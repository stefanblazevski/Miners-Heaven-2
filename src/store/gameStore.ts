import { create } from 'zustand';
import { GameStore, Position, Direction, Block, BlockType } from '../types/game';

const GRID_SIZE = 20;
const INITIAL_PLAYER_POSITION = { x: GRID_SIZE / 2, y: 0 };

const generateInitialBlocks = (): Block[][] => {
  const blocks: Block[][] = [];
  
  for (let y = 0; y < GRID_SIZE; y++) {
    blocks[y] = [];
    for (let x = 0; x < GRID_SIZE; x++) {
      const blockType = getRandomBlockType(y);
      blocks[y][x] = createBlock(blockType, { x, y });
    }
  }
  
  return blocks;
};

const getRandomBlockType = (depth: number): BlockType => {
  const random = Math.random();
  
  if (depth < 5) return 'dirt';
  if (depth < 10) {
    if (random < 0.8) return 'dirt';
    return 'stone';
  }
  if (depth < 15) {
    if (random < 0.6) return 'stone';
    if (random < 0.8) return 'iron';
    return 'dirt';
  }
  
  if (random < 0.4) return 'stone';
  if (random < 0.6) return 'iron';
  if (random < 0.8) return 'gold';
  if (random < 0.95) return 'diamond';
  return 'stone';
};

const createBlock = (type: BlockType, position: Position): Block => {
  const blockProperties = {
    dirt: { durability: 1, value: 1 },
    stone: { durability: 2, value: 2 },
    iron: { durability: 3, value: 5 },
    gold: { durability: 4, value: 10 },
    diamond: { durability: 5, value: 20 },
  };

  return {
    type,
    position,
    ...blockProperties[type],
  };
};

export const useGameStore = create<GameStore>((set) => ({
  player: {
    position: INITIAL_PLAYER_POSITION,
    direction: 'down',
    health: 100,
    money: 0,
    pickaxePower: 1,
  },
  blocks: generateInitialBlocks(),
  gameStarted: false,
  paused: false,

  movePlayer: (direction: Direction) => 
    set((state) => {
      const newPosition = { ...state.player.position };
      
      switch (direction) {
        case 'up':
          if (newPosition.y > 0) newPosition.y--;
          break;
        case 'down':
          if (newPosition.y < GRID_SIZE - 1) newPosition.y++;
          break;
        case 'left':
          if (newPosition.x > 0) newPosition.x--;
          break;
        case 'right':
          if (newPosition.x < GRID_SIZE - 1) newPosition.x++;
          break;
      }

      return {
        ...state,
        player: {
          ...state.player,
          position: newPosition,
          direction,
        },
      };
    }),

  digBlock: (position: Position) =>
    set((state) => {
      const block = state.blocks[position.y][position.x];
      if (!block) return state;

      const newBlocks = [...state.blocks];
      const damage = state.player.pickaxePower;

      if (block.durability <= damage) {
        newBlocks[position.y][position.x] = null;
        return {
          ...state,
          blocks: newBlocks,
          player: {
            ...state.player,
            money: state.player.money + block.value,
          },
        };
      }

      newBlocks[position.y][position.x] = {
        ...block,
        durability: block.durability - damage,
      };

      return {
        ...state,
        blocks: newBlocks,
      };
    }),

  startGame: () => set({ gameStarted: true, paused: false }),
  pauseGame: () => set((state) => ({ paused: !state.paused })),
  resetGame: () => set({
    player: {
      position: INITIAL_PLAYER_POSITION,
      direction: 'down',
      health: 100,
      money: 0,
      pickaxePower: 1,
    },
    blocks: generateInitialBlocks(),
    gameStarted: false,
    paused: false,
  }),
}));