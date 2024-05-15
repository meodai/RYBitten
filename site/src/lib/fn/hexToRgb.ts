import type { ColorCoords } from 'rybitten';

export const hexToRgb = (hex: string): ColorCoords => {
  const bigint = parseInt(hex.slice(1), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return [r / 255, g / 255, b / 255];
}