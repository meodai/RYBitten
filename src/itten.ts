import type { ColorCube } from "./cubes";

/**
 * Default RYB color cube based on Johannes Itten's chromatic circle (1961).
 * Contains 8 key colors in RGB space:
 * 1. White    - Base color, slightly warm [253/255, 246/255, 237/255]
 * 2. Red      - Primary [227/255, 36/255, 33/255]
 * 3. Yellow   - Primary [243/255, 230/255, 0]
 * 4. Orange   - Secondary [240/255, 142/255, 28/255]
 * 5. Blue     - Primary [22/255, 153/255, 218/255]
 * 6. Violet   - Secondary [120/255, 34/255, 170/255]
 * 7. Green    - Secondary [0, 142/255, 91/255]
 * 8. Black    - Shade [29/255, 28/255, 28/255]
 */
export const RYB_ITTEN: ColorCube = [
  // white
  [253 / 255, 246 / 255, 237 / 255],

  // red
  [227 / 255, 36 / 255, 33 / 255],

  // yellow
  [243 / 255, 230 / 255, 0],

  // orange
  [240 / 255, 142 / 255, 28 / 255],

  // blue
  [22 / 255, 153 / 255, 218 / 255],

  // pink / but often violet in old color wheels
  [120 / 255, 34 / 255, 170 / 255],

  // green
  [0, 142 / 255, 91 / 255],

  // black
  [29 / 255, 28 / 255, 28 / 255],
];
