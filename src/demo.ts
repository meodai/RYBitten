import "./demo.css";
import { RYB_CUBE, ColorCoords, ColorCube, rybHsl2rgb } from "./main";

console.log(RYB_CUBE);
const DEMO_RYB_CUBE: ColorCube = [
  [0.11372549019607843, 0.10980392156862745, 0.10980392156862745],
  [0.9686274509803922, 0.17647058823529413, 0.1607843137254902],
  [0.9921568627450981, 0.796078431372549, 0],
  [0.9803921568627451, 0.4, 0.050980392156862744],
  [0.06666666666666667, 0.3803921568627451, 0.6666666666666666],
  [0.396078431372549, 0.2235294117647059, 0.5411764705882353],
  [0.27450980392156865, 0.5450980392156862, 0.28627450980392155],
  [0.9921568627450981, 0.9647058823529412, 0.9294117647058824],
];

const formatCSS = (rgb: ColorCoords): string => {
  return `rgb(${Math.round(rgb[0] * 255)} ${Math.round(rgb[1] * 255)} ${Math.round(rgb[2] * 255)})`;
};

const hexToRgb = (hex: string): ColorCoords => {
  const bigint = parseInt(hex.slice(1), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return [r / 255, g / 255, b / 255];
};

const rgbToHex = (rgb: ColorCoords): string => {
  return `#${rgb
    .map((c) =>
      Math.round(c * 255)
        .toString(16)
        .padStart(2, "0"),
    )
    .join("")}`;
};

function tuneH(h: number): number {
  return Math.pow(h, 2 / 3);
}

const getColorsHSL = (
  amount = 12,
  s = 1,
  l = 0.5,
  hFn = (h: number): number => h,
  oldScool = false,
) =>
  new Array(amount).fill(0).map((_, i) => {
    const h = oldScool
      ? hFn(1 - i / amount) * 360 + 120
      : hFn(i / amount) * 360;
    return formatCSS(rybHsl2rgb([h, s, l], DEMO_RYB_CUBE));
  });

// generate an array containing each color gradient as
// an array
const colorStairs = (floors = 4, firstFloorSteps = 10): string[][] => [
  getColorsHSL(firstFloorSteps, 1, 0.5),
  ...new Array(floors - 1)
    .fill("")
    .map((_, i) =>
      getColorsHSL(
        firstFloorSteps * 2 * (i + 1),
        1,
        0.5 + ((i + 1) / floors) * 0.5,
      ),
    ),
];

const colorStairArrToGradient = (starisArr: string[][]): string => {
  //const gradients = starisArr.reverse();
  const gradients = starisArr;
  return gradients.reduce(
    (prevGrad, colors, i) =>
      (prevGrad +=
        (prevGrad ? "," : "") +
        `linear-gradient(90deg, ${
          !i
            ? colors.join()
            : colors
                .map(
                  (c, i) =>
                    `${c} ${(i / colors.length) * 100}% ${((i + 1) / colors.length) * 100}%`,
                )
                .join()
        })`),
    "",
  );
};

function generateColorSection(stairs: string[][], gradients: string): void {
  document.documentElement.style.setProperty("--g", gradients);
  document.documentElement.style.setProperty("--gs", `${stairs.length}`);
  document.documentElement.style.setProperty(
    "--gp",
    stairs
      .map((_, i) => `0% calc(${i * (100 / (stairs.length - 1))}% - 1px)`)
      .join(),
  );
}

const colorsToHardStopGradients = (cls: string[]): string =>
  cls
    .map(
      (c, i) =>
        `${c} ${(i / cls.length) * 100}% ${((i + 1) / cls.length) * 100}%`,
    )
    .join();

const $w = document.querySelector('[data-c="w"]') as HTMLInputElement;
const $r = document.querySelector('[data-c="r"]') as HTMLInputElement;
const $y = document.querySelector('[data-c="y"]') as HTMLInputElement;
const $o = document.querySelector('[data-c="o"]') as HTMLInputElement;
const $b = document.querySelector('[data-c="b"]') as HTMLInputElement;
const $v = document.querySelector('[data-c="v"]') as HTMLInputElement;
const $g = document.querySelector('[data-c="g"]') as HTMLInputElement;
const $black = document.querySelector('[data-c="0"]') as HTMLInputElement;

$w.parentElement!.style.setProperty("--c", `var(--white)`);
$r.parentElement!.style.setProperty("--c", `var(--red)`);
$y.parentElement!.style.setProperty("--c", `var(--yellow)`);
$o.parentElement!.style.setProperty("--c", `var(--orange)`);
$b.parentElement!.style.setProperty("--c", `var(--blue)`);
$v.parentElement!.style.setProperty("--c", `var(--violet)`);
$g.parentElement!.style.setProperty("--c", `var(--green)`);
$black.parentElement!.style.setProperty("--c", `var(--black)`);

const lightnessSteps = 9;

const repaint = () => {
  const colors = getColorsHSL(36, 1, 0.5, (h) => h, false);

  const colorsHSL = new Array(36).fill(0).map((_, index) => {
    const rybAngle = index * 10;
    return `hsl(${rybAngle}, 100%, 50%)`;
  });

  document.documentElement.style.setProperty(
    "--gradientHSLHard",
    colorsToHardStopGradients(colorsHSL),
  );
  document.documentElement.style.setProperty("--gradientHSL", colorsHSL.join());
  document.documentElement.style.setProperty(
    "--gradientHard",
    colorsToHardStopGradients(colors),
  );
  document.documentElement.style.setProperty("--gradient", colors.join());

  for (let i = 0; i < lightnessSteps; i++) {
    const colors = getColorsHSL(36, 0.4, 0.1 + (i / lightnessSteps) * 0.9);
    document.documentElement.style.setProperty(
      `--gradient-l${i}`,
      colors.join(),
    );
  }

  for (let i = 0; i < 36; i++) {
    const color = formatCSS(
      rybHsl2rgb([tuneH((i + 1) / 36) * 360, 1, 0.5], DEMO_RYB_CUBE),
    );
    document.documentElement.style.setProperty(`--color-${i + 1}`, color);
  }

  document.documentElement.style.setProperty(
    "--stops-3",
    colorsToHardStopGradients(getColorsHSL(3, 1, 0.5, (h) => h, true)),
  );
  document.documentElement.style.setProperty(
    "--stops-6",
    colorsToHardStopGradients(
      getColorsHSL(6, 1, 0.5, (h) => h, true).filter((_, i) => i % 2),
    ),
  );
  document.documentElement.style.setProperty(
    "--stops-12",
    colorsToHardStopGradients(getColorsHSL(12, 1, 0.5, (h) => h, true)),
  );
  document.documentElement.style.setProperty(
    "--stops-24",
    colorsToHardStopGradients(getColorsHSL(24, 1, 0.5, (h) => h, true)),
  );
  document.documentElement.style.setProperty(
    "--stops-48",
    colorsToHardStopGradients(getColorsHSL(48, 1, 0.5, (h) => h, true)),
  );

  document.documentElement.style.setProperty(
    "--white",
    formatCSS(DEMO_RYB_CUBE[7]),
  );
  document.documentElement.style.setProperty(
    "--black",
    formatCSS(DEMO_RYB_CUBE[0]),
  );
  document.documentElement.style.setProperty(
    "--red",
    formatCSS(DEMO_RYB_CUBE[1]),
  );
  document.documentElement.style.setProperty(
    "--yellow",
    formatCSS(DEMO_RYB_CUBE[2]),
  );
  document.documentElement.style.setProperty(
    "--orange",
    formatCSS(DEMO_RYB_CUBE[3]),
  );
  document.documentElement.style.setProperty(
    "--blue",
    formatCSS(DEMO_RYB_CUBE[4]),
  );
  document.documentElement.style.setProperty(
    "--violet",
    formatCSS(DEMO_RYB_CUBE[5]),
  );
  document.documentElement.style.setProperty(
    "--green",
    formatCSS(DEMO_RYB_CUBE[6]),
  );

  $w.value = rgbToHex(DEMO_RYB_CUBE[7]);
  $r.value = rgbToHex(DEMO_RYB_CUBE[1]);
  $y.value = rgbToHex(DEMO_RYB_CUBE[2]);
  $o.value = rgbToHex(DEMO_RYB_CUBE[3]);
  $b.value = rgbToHex(DEMO_RYB_CUBE[4]);
  $v.value = rgbToHex(DEMO_RYB_CUBE[5]);
  $g.value = rgbToHex(DEMO_RYB_CUBE[6]);
  $black.value = rgbToHex(DEMO_RYB_CUBE[0]);

  console.log("current RYB_CUBE", DEMO_RYB_CUBE);

  const stairs = colorStairs(4, 10);
  const gradient = colorStairArrToGradient(stairs);

  generateColorSection(stairs, gradient);
};

repaint();

const els = [$black, $r, $y, $o, $b, $v, $g, $w];

document.querySelector("[data-edges]")?.addEventListener("input", (e) => {
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
  if (index > -1) {
    DEMO_RYB_CUBE[index] = hexToRgb(value);
    repaint();
  }
});
