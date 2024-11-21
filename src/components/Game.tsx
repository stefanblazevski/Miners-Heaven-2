import React, { useEffect } from 'react';
import { Stage, Container, Sprite, Graphics } from '@pixi/react';
import { useGameStore } from '../store/gameStore';
import { Direction, Position } from '../types/game';
import * as PIXI from 'pixi.js';

const BLOCK_SIZE = 32;
const CANVAS_WIDTH = BLOCK_SIZE * 20;
const CANVAS_HEIGHT = BLOCK_SIZE * 20;

// Load textures
PIXI.Assets.add('dirt', '/textures/dirt.png');
PIXI.Assets.add('stone', '/textures/stone.png');
PIXI.Assets.add('iron', '/textures/iron.png');
PIXI.Assets.add('gold', '/textures/gold.png');
PIXI.Assets.add('diamond', '/textures/diamond.png');
PIXI.Assets.add('player', '/textures/player.png');
PIXI.Assets.add('background', '/textures/background.png');
PIXI.Assets.add('clouds', '/textures/clouds.png');

export const Game: React.FC = () => {
  const {
    player,
    blocks,
    gameStarted,
    paused,
    movePlayer,
    digBlock,
    startGame,
    pauseGame,
  } = useGameStore();

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!gameStarted || paused) return;

      const keyActions: { [key: string]: Direction } = {
        ArrowUp: 'up',
        ArrowDown: 'down',
        ArrowLeft: 'left',
        ArrowRight: 'right',
        w: 'up',
        s: 'down',
        a: 'left',
        d: 'right',
      };

      const direction = keyActions[e.key];
      if (direction) {
        movePlayer(direction);
      } else if (e.key === ' ') {
        const targetPosition = getTargetPosition(player.position, player.direction);
        digBlock(targetPosition);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameStarted, paused, movePlayer, digBlock, player]);

  const getTargetPosition = (position: Position, direction: Direction): Position => {
    switch (direction) {
      case 'up':
        return { x: position.x, y: position.y - 1 };
      case 'down':
        return { x: position.x, y: position.y + 1 };
      case 'left':
        return { x: position.x - 1, y: position.y };
      case 'right':
        return { x: position.x + 1, y: position.y };
    }
  };

  const Background = () => (
    <Container>
      <Sprite 
        image="/textures/background.png"
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        x={0}
        y={0}
      />
      <Sprite 
        image="/textures/clouds.png"
        width={CANVAS_WIDTH}
        height={200}
        x={-player.position.x * 0.2}
        y={0}
        alpha={0.7}
      />
    </Container>
  );

  const Blocks = () => (
    <Container>
      {blocks.map((row, y) =>
        row.map((block, x) => {
          if (!block) return null;
          return (
            <Sprite
              key={`${x}-${y}`}
              image={`/textures/${block.type}.png`}
              x={x * BLOCK_SIZE}
              y={y * BLOCK_SIZE}
              width={BLOCK_SIZE}
              height={BLOCK_SIZE}
              alpha={block.durability / 5}
            />
          );
        })
      )}
    </Container>
  );

  const Player = () => (
    <Sprite
      image="/textures/player.png"
      x={player.position.x * BLOCK_SIZE}
      y={player.position.y * BLOCK_SIZE}
      width={BLOCK_SIZE}
      height={BLOCK_SIZE}
      scale={player.direction === 'left' ? { x: -1, y: 1 } : { x: 1, y: 1 }}
      anchor={0.5}
    />
  );

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="mb-4 flex gap-4">
        <div className="text-lg">Money: ${player.money}</div>
        <div className="text-lg">Health: {player.health}</div>
        <div className="text-lg">Pick Power: {player.pickaxePower}</div>
      </div>
      
      {!gameStarted ? (
        <button
          className="px-4 py-2 bg-green-500 rounded hover:bg-green-600 mb-4"
          onClick={startGame}
        >
          Start Game
        </button>
      ) : (
        <button
          className="px-4 py-2 bg-yellow-500 rounded hover:bg-yellow-600 mb-4"
          onClick={pauseGame}
        >
          {paused ? 'Resume' : 'Pause'}
        </button>
      )}

      <Stage
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        options={{ backgroundColor: 0x87CEEB }}
        className="border-4 border-gray-700 rounded"
      >
        <Background />
        <Blocks />
        <Player />
      </Stage>

      <div className="mt-4 text-sm text-gray-400">
        Use Arrow Keys or WASD to move • Space to dig
      </div>
    </div>
  );
};