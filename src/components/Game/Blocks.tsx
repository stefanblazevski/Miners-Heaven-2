import React, { useRef } from 'react';
import { Container, Sprite } from '@pixi/react';
import { Block } from '../../types/game';
import { animateBlockBreak } from '../../utils/animations';

interface BlocksProps {
  blocks: (Block | null)[][];
  blockSize: number;
  onBlockBreak: (x: number, y: number) => void;
}

export const Blocks: React.FC<BlocksProps> = ({ blocks, blockSize, onBlockBreak }) => {
  const blockRefs = useRef<{ [key: string]: any }>({});

  const handleBlockBreak = (x: number, y: number) => {
    const key = `${x}-${y}`;
    const sprite = blockRefs.current[key];
    if (sprite) {
      animateBlockBreak(sprite, () => onBlockBreak(x, y));
    }
  };

  return (
    <Container>
      {blocks.map((row, y) =>
        row.map((block, x) => {
          if (!block) return null;
          const key = `${x}-${y}`;
          return (
            <Sprite
              key={key}
              ref={(sprite) => {
                if (sprite) blockRefs.current[key] = sprite;
              }}
              texture={block.type}
              x={x * blockSize}
              y={y * blockSize}
              width={blockSize}
              height={blockSize}
              alpha={block.durability / 5}
              interactive={true}
              onclick={() => handleBlockBreak(x, y)}
            />
          );
        })
      )}
    </Container>
  );
};