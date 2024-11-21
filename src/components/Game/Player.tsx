import React, { useRef, useEffect } from 'react';
import { Sprite, useTick } from '@pixi/react';
import { Position, Direction } from '../../types/game';
import { animateMovement } from '../../utils/animations';

interface PlayerProps {
  position: Position;
  direction: Direction;
  blockSize: number;
  isDigging: boolean;
}

export const Player: React.FC<PlayerProps> = ({ position, direction, blockSize, isDigging }) => {
  const spriteRef = useRef<any>(null);
  const prevPosition = useRef<Position>(position);
  const frameCount = useRef(0);

  useEffect(() => {
    if (spriteRef.current && (prevPosition.current.x !== position.x || prevPosition.current.y !== position.y)) {
      animateMovement(spriteRef.current, prevPosition.current, position, blockSize);
      prevPosition.current = position;
    }
  }, [position, blockSize]);

  useTick((delta) => {
    if (!spriteRef.current) return;
    
    // Bobbing animation
    frameCount.current += delta;
    const bob = Math.sin(frameCount.current * 0.1) * 2;
    spriteRef.current.y = position.y * blockSize + blockSize / 2 + bob;
    
    // Update sprite scale for direction
    spriteRef.current.scale.x = direction === 'left' ? -1 : 1;
  });

  return (
    <Sprite
      ref={spriteRef}
      texture="player"
      x={position.x * blockSize + blockSize / 2}
      y={position.y * blockSize + blockSize / 2}
      width={blockSize}
      height={blockSize}
      anchor={0.5}
      scale={{ x: direction === 'left' ? -1 : 1, y: 1 }}
    />
  );
};