import { ryb2rgb, RYB_CUBE, ColorCoords } from "./main";

console.log(RYB_CUBE);

const $app = document.getElementById("app") as HTMLElement;

function wrapAngle(angle: number): number {
  // Wrap angle between 0 and 360
  return ((angle % 360) + 360) % 360; // this avoids negative results
}

function hslToRgb(hsl: ColorCoords): ColorCoords {
  const [h, s, l] = hsl;
  // Normalize hue to a range between 0 and 1
  const normalizedHue = wrapAngle(h) / 360;

  let r: number, g: number, b: number;

  if (s === 0) {
    r = g = b = l; // achromatic (grayscale)
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;

    function hue2rgb(p: number, q: number, t: number): number {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    }

    r = hue2rgb(p, q, normalizedHue + 1 / 3);
    g = hue2rgb(p, q, normalizedHue);
    b = hue2rgb(p, q, normalizedHue - 1 / 3);
  }

  return [r, g, b] as ColorCoords;
}

function hsl2farbrad(hsl: ColorCoords): ColorCoords {
  const [h, s, l] = hsl;
  const rgbColor = hslToRgb([wrapAngle(h), s, l]);
  return ryb2rgb(rgbColor);
}

// generate hard stop css gradient
function generateHardStopGradient(colors: string[]): string {
  const gradient = colors
    .map((color, index) => {
      return `${color} ${(index * 100) / (colors.length - 1)}%`;
    })
    .join(", ");

  return `${gradient}` as string;
}

const colors = new Array(36).fill(0).map((_, index) => {
  const rybAngle = index * 10;
  const [r, g, b] = hsl2farbrad([rybAngle, 1, 0.5]);
  const color = `rgb(${Math.round(r * 255)} ${Math.round(g * 255)} ${Math.round(b * 255)})`;
  return color;
});

const colorsHSL = new Array(36).fill(0).map((_, index) => {
  const rybAngle = index * 10;
  return `hsl(${rybAngle}, 100%, 50%)`;
});

$app.style.setProperty("--gradientHSL", generateHardStopGradient(colorsHSL));
$app.style.setProperty("--gradient", generateHardStopGradient(colors));
