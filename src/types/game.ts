export type Position = {
  x: number;
  y: number;
};

export type Direction = 'up' | 'down' | 'left' | 'right';

export type BlockType = 'dirt' | 'stone' | 'iron' | 'gold' | 'diamond';

export type Block = {
  type: BlockType;
  position: Position;
  durability: number;
  value: number;
};

export type Player = {
  position: Position;
  direction: Direction;
  health: number;
  money: number;
  pickaxePower: number;
};

export type GameState = {
  player: Player;
  blocks: Block[][];
  gameStarted: boolean;
  paused: boolean;
};

export type GameStore = GameState & {
  movePlayer: (direction: Direction) => void;
  digBlock: (position: Position) => void;
  startGame: () => void;
  pauseGame: () => void;
  resetGame: () => void;
};