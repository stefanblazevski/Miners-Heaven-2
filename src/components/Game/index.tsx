import React, { useEffect, useState } from 'react';
import { Stage } from '@pixi/react';
import * as PIXI from 'pixi.js';
import { useGameStore } from '../../store/gameStore';
import { Direction, Position } from '../../types/game';
import { Background } from './Background';
import { Blocks } from './Blocks';
import { Player } from './Player';

const BLOCK_SIZE = 32;
const CANVAS_WIDTH = BLOCK_SIZE * 20;
const CANVAS_HEIGHT = BLOCK_SIZE * 20;

const TEXTURES = {
  dirt: '/textures/dirt.png',
  stone: '/textures/stone.png',
  iron: '/textures/iron.png',
  gold: '/textures/gold.png',
  diamond: '/textures/diamond.png',
  player: '/textures/player.png',
  background: '/textures/background.png',
  clouds: '/textures/clouds.png',
} as const;

export const Game: React.FC = () => {
  const [texturesLoaded, setTexturesLoaded] = useState(false);
  const [isDigging, setIsDigging] = useState(false);
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
    const loadTextures = async () => {
      try {
        await Promise.all(
          Object.entries(TEXTURES).map(([key, url]) =>
            PIXI.Assets.load(url).then(texture => {
              const baseTexture = PIXI.BaseTexture.from(url);
              baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
              PIXI.Texture.from(url).baseTexture = baseTexture;
              PIXI.Assets.cache.set(key, PIXI.Texture.from(url));
            })
          )
        );
        setTexturesLoaded(true);
      } catch (error) {
        console.error('Failed to load textures:', error);
      }
    };

    loadTextures();
  }, []);

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
      } else if (e.key === ' ' && !isDigging) {
        setIsDigging(true);
        const targetPosition = getTargetPosition(player.position, player.direction);
        digBlock(targetPosition);
        setTimeout(() => setIsDigging(false), 300);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameStarted, paused, movePlayer, digBlock, player, isDigging]);

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

  if (!texturesLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        Loading textures...
      </div>
    );
  }

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
        options={{ 
          backgroundColor: 0x87CEEB,
          antialias: false,
        }}
        className="border-4 border-gray-700 rounded"
      >
        <Background 
          width={CANVAS_WIDTH} 
          height={CANVAS_HEIGHT} 
          playerPosition={player.position} 
        />
        <Blocks 
          blocks={blocks} 
          blockSize={BLOCK_SIZE}
          onBlockBreak={(x, y) => digBlock({ x, y })}
        />
        <Player 
          position={player.position} 
          direction={player.direction} 
          blockSize={BLOCK_SIZE}
          isDigging={isDigging}
        />
      </Stage>

      <div className="mt-4 text-sm text-gray-400">
        Use Arrow Keys or WASD to move • Space to dig
      </div>
    </div>
  );
};