import React, { useRef } from 'react';
import { Container, Sprite, TilingSprite } from '@pixi/react';
import { Position } from '../../types/game';

interface BackgroundProps {
  width: number;
  height: number;
  playerPosition: Position;
}

export const Background: React.FC<BackgroundProps> = ({ width, height, playerPosition }) => {
  const cloudsRef = useRef<any>(null);

  return (
    <Container>
      <TilingSprite 
        texture="background"
        width={width}
        height={height}
        tilePosition={{ x: -playerPosition.x * 0.1, y: 0 }}
      />
      <TilingSprite
        ref={cloudsRef}
        texture="clouds"
        width={width}
        height={200}
        tilePosition={{ x: -playerPosition.x * 0.2, y: 0 }}
        alpha={0.7}
      />
    </Container>
  );
};