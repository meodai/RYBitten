import "./demo.css";
import { ryb2rgb, RYB_CUBE, ColorCoords } from "./main";

console.log(RYB_CUBE);

const $app = document.getElementById("app") as HTMLElement;

const formatCSS = (rgb: ColorCoords): string => {
  return `rgb(${Math.round(rgb[0] * 255)} ${Math.round(rgb[1] * 255)} ${Math.round(rgb[2] * 255)})`;
}

const hexToRgb = (hex: string): ColorCoords => {
  const bigint = parseInt(hex.slice(1), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return [r / 255, g / 255, b / 255];
}

const rgbToHex = (rgb: ColorCoords): string => {
  return `#${rgb.map((c) => Math.round(c * 255).toString(16).padStart(2, '0')).join('')}`;
}

function wrapAngle(angle: number): number {
  // Wrap angle between 0 and 360
  return ((angle % 360) + 360) % 360; // this avoids negative results
}

function hslToRgb(hsl: ColorCoords): ColorCoords {
  let [h, s, l] = hsl;
  h = wrapAngle(h || 0);
  let m1 = l + s * (l < 0.5 ? l : 1 - l);
  let m2 = m1 - (m1 - l) * 2 * Math.abs(((h / 60) % 2) - 1);
  let res;
  switch (Math.floor(h / 60)) {
    case 0:
    res = [ m1, m2, 2 * l - m1 ];
    break;
    case 1:
    res = [ m2, m1, 2 * l - m1 ];
    break;
    case 2:
    res = [ 2 * l - m1, m1, m2 ];
    break;
    case 3:
    res = [ 2 * l - m1, m2, m1 ];
    break;
    case 4:
    res = [ m2, 2 * l - m1, m1 ];
    break;
    case 5:
    res = [ m1, 2 * l - m1, m2 ];
    break;
    default:
    res = [ 2 * l - m1, 2 * l - m1, 2 * l - m1 ];
  }
  return res as ColorCoords;
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

function tuneH (h: number): number {
  return Math.pow(h, 2 / 3);
}

const $w = document.querySelector('[data-c="w"]') as HTMLInputElement;
const $r = document.querySelector('[data-c="r"]')  as HTMLInputElement;
const $y = document.querySelector('[data-c="y"]')  as HTMLInputElement;
const $o = document.querySelector('[data-c="o"]')  as HTMLInputElement;
const $b = document.querySelector('[data-c="b"]')  as HTMLInputElement;
const $v = document.querySelector('[data-c="v"]')  as HTMLInputElement;
const $g = document.querySelector('[data-c="g"]')  as HTMLInputElement;
const $black = document.querySelector('[data-c="0"]')  as HTMLInputElement;

$w.parentElement!.style.setProperty('--c', `var(--white)`);
$r.parentElement!.style.setProperty('--c', `var(--red)`);
$y.parentElement!.style.setProperty('--c', `var(--yellow)`);
$o.parentElement!.style.setProperty('--c', `var(--orange)`);
$b.parentElement!.style.setProperty('--c', `var(--blue)`);
$v.parentElement!.style.setProperty('--c', `var(--violet)`);
$g.parentElement!.style.setProperty('--c', `var(--green)`);
$black.parentElement!.style.setProperty('--c', `var(--black)`);

const repaint = () => {
const colors = new Array(36).fill(0).map((_, index) => {
  const rybAngle = index * 10;
  const relI = rybAngle / 360;
  return formatCSS(hsl2farbrad([tuneH(relI) * 360, 1, 0.5]));
});

const colorsHSL = new Array(36).fill(0).map((_, index) => {
  const rybAngle = index * 10;
  return `hsl(${rybAngle}, 100%, 50%)`;
});

const getColorsHSL = (amount = 12, s = 1, l = .5) => (new Array(amount)).fill('').map((_,i) => {
  return formatCSS(
     hsl2farbrad([(1 - i/amount) * 360 + 120, s, l])
  );
});

const colorsToHardStopGradients = (cls:string[]):string => cls.map((c,i) => `${c} ${i/cls.length * 100}% ${(i+1)/cls.length * 100}%`).join();

$app.style.setProperty("--gradientHSL", generateHardStopGradient(colorsHSL));
$app.style.setProperty("--gradient", generateHardStopGradient(colors));

document.documentElement.style.setProperty('--stops-3', colorsToHardStopGradients(getColorsHSL(3)));
document.documentElement.style.setProperty('--stops-6', colorsToHardStopGradients(getColorsHSL(6).filter((c,i) => i % 2)));
document.documentElement.style.setProperty('--stops-12', colorsToHardStopGradients(getColorsHSL(12)));
document.documentElement.style.setProperty('--stops-24', colorsToHardStopGradients(getColorsHSL(24)));
document.documentElement.style.setProperty('--stops-48', colorsToHardStopGradients(getColorsHSL(48)));

document.documentElement.style.setProperty(
  '--white',
  formatCSS(RYB_CUBE[7])
);
document.documentElement.style.setProperty(
  '--black',
  formatCSS(RYB_CUBE[0])
);
document.documentElement.style.setProperty(
  '--red',
  formatCSS(RYB_CUBE[1])
);
document.documentElement.style.setProperty(
  '--yellow',
  formatCSS(RYB_CUBE[2])
);
document.documentElement.style.setProperty(
  '--orange',
  formatCSS(RYB_CUBE[3])
);
document.documentElement.style.setProperty(
  '--blue',
  formatCSS(RYB_CUBE[4])
);
document.documentElement.style.setProperty(
  '--violet',
  formatCSS(RYB_CUBE[5])
);
document.documentElement.style.setProperty(
  '--green',
  formatCSS(RYB_CUBE[6])
);

$w.value = rgbToHex(RYB_CUBE[7]);
$r.value = rgbToHex(RYB_CUBE[1]);
$y.value = rgbToHex(RYB_CUBE[2]);
$o.value = rgbToHex(RYB_CUBE[3]);
$b.value = rgbToHex(RYB_CUBE[4]);
$v.value = rgbToHex(RYB_CUBE[5]);
$g.value = rgbToHex(RYB_CUBE[6]);
$black.value = rgbToHex(RYB_CUBE[0]);
}

repaint();

const els = [$black, $r, $y, $o, $b, $v, $g, $w];

document.querySelector('[data-edges]')?.addEventListener('input', (e) => {
  const $target = e.target;
  if (!($target instanceof HTMLInputElement)) {
    return;
  }
  const value = $target.value;
  const $tarInEls = els.find(($el) => $el.isEqualNode($target));
  if (!$tarInEls) {
    return;
  }
  const index = els.indexOf($tarInEls);
  if ( index > -1 ) {
    RYB_CUBE[index] = hexToRgb(value);
    repaint();
  }
});
