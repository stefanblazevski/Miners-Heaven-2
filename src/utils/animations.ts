import gsap from 'gsap';
import { Position } from '../types/game';

export const animateMovement = (
  sprite: any,
  from: Position,
  to: Position,
  blockSize: number
) => {
  gsap.to(sprite, {
    x: to.x * blockSize + blockSize / 2,
    y: to.y * blockSize + blockSize / 2,
    duration: 0.2,
    ease: "power2.out"
  });
};

export const animateDigging = (
  sprite: any,
  onComplete?: () => void
) => {
  gsap.to(sprite.scale, {
    x: 1.2,
    y: 1.2,
    duration: 0.1,
    yoyo: true,
    repeat: 1,
    onComplete
  });
};

export const animateBlockBreak = (
  sprite: any,
  onComplete?: () => void
) => {
  gsap.to(sprite, {
    alpha: 0,
    y: sprite.y - 10,
    duration: 0.3,
    ease: "power2.in",
    onComplete: () => {
      if (onComplete) onComplete();
    }
  });
};