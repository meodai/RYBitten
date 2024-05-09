import "./demo.css";
import { ColorCoords, ColorCube, rybHsl2rgb, ryb2rgb, cubes } from "./main";
//import { generateColorRamp } from "rampensau";

let currentCube: ColorCube = cubes.get("itten-normalized")!.cube;

const logCube = (cube: ColorCube) => {
  console.log("Customized RYB_CUBE");
  console.log(cube.map((row) => row.map((it) => it * 255 + "/255")));
};

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
      : hFn((i + 1) / amount) * 360;
    return formatCSS(
      rybHsl2rgb([h, s, l], {
        cube: currentCube,
      }),
    );
  });

const romanNumerals = [
  "Zero",
  "I",
  "II",
  "III",
  "IV",
  "V",
  "VI",
  "VII",
  "VIII",
  "IX",
  "X",
  "XI",
  "XII",
  "XIII",
  "XIV",
  "XV",
  "XVI",
  "XVII",
  "XVIII",
  "XIX",
  "XX",
  "XXI",
  "XXII",
  "XXIII",
  "XXIV",
  "XXV",
  "XXVI",
  "XXVII",
  "XXVIII",
  "XXIX",
  "XXX",
];

const createRamps = async (amount = 18, stepsPerRamp = 9) => {
  const ramps = new Array(amount - 1).fill(0).map((_, i) => {
    const h = i / (amount - 1);
    const steps = new Array(stepsPerRamp).fill(0).map((_, j) => {
      const l = (j + 1) / (stepsPerRamp + 1);
      return rgbToHex(
        rybHsl2rgb([h * 360, 1, 1 - l], {
          cube: currentCube,
        }),
      );
    });
    return steps;
  });

  // add grey ramp
  ramps.push(
    new Array(stepsPerRamp).fill(0).map((_, j) => {
      const l = (j + 1) / (stepsPerRamp + 1);
      return rgbToHex(
        ryb2rgb([l, l, l], {
          cube: currentCube,
        }),
      );
    }),
  );

  const allHexes = ramps.flat().map((hex) => {
    // remove the first char (#)
    return hex.slice(1);
  });

  const names = await fetch(
    `https://api.color.pizza/v1/?values=${allHexes.join()}&list=bestOf&noduplicates=true`,
    {
      method: "GET",
    },
  )
    .then((res) => res.json())
    .then((data) => {
      return data.colors;
    });

  const namesForHexes = allHexes.reduce(
    (acc: { [key: string]: string }, hex: string) => {
      const prefixedHex = `#${hex}`;
      const color = names.find(
        (color: any) => color.requestedHex === prefixedHex,
      );
      acc[prefixedHex] = color?.name || "unknown";
      return acc;
    },
    {},
  );

  const $wrapper = document.querySelector("[data-ramps]") as HTMLElement;
  $wrapper.innerHTML = ramps
    .map((ramp, i) => {
      return `<div class="ramp">
      <h2>${romanNumerals[i + 1]}</h2>
      ${ramp
        .map((hex) => {
          return `<div class="ramp__step" style="--c: ${hex}; --rnd: ${-1 + Math.random() * 2}; --rnd2: ${Math.random()};">
            <div class="ramp__label">
              <span>${namesForHexes[hex]}</span>
              <span>${hex}</span>
            </div>
          </div>`;
        })
        .join("")}
    </div>`;
    })
    .join("");
};

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
                    `${c} ${(i / (colors.length - 1)) * 100}% ${((i + 1) / (colors.length - 1)) * 100}%`,
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
$v.parentElement!.style.setProperty("--c", `var(--pink)`);
$g.parentElement!.style.setProperty("--c", `var(--green)`);
$black.parentElement!.style.setProperty("--c", `var(--black)`);

const lightnessSteps = 9;

let timer: number | null = null;

// color swatch
const $swatchRGB = document.querySelector("[data-rgb]") as HTMLElement;
const $swatchRYB = document.querySelector("[data-ryb]") as HTMLElement;
const $swatchRGBinput = $swatchRGB.querySelector("input") as HTMLInputElement;

let swatchTimer: number | null = null;
function setSwatchColor(rgb: ColorCoords, bypassTimer = false) {
  const hex = rgbToHex(rgb);
  const ryb = ryb2rgb(rgb, { cube: currentCube });
  const hexRYB = rgbToHex(ryb);
  const cssRGB = formatCSS(rgb);
  const cssRYB = formatCSS(ryb);

  $swatchRGB.style.setProperty("--c", cssRGB);
  $swatchRGBinput.value = hex;
  $swatchRYB.style.setProperty("--c", cssRYB);
  const [r, g, b] = rgb.map((c) => Math.round(c * 255));
  const [r2, y2, b2] = ryb.map((c) => Math.round(c * 255));

  $swatchRGB.querySelector(".swatch__value")!.textContent = `${r} ${g} ${b}`;
  $swatchRYB.querySelector(".swatch__value")!.textContent = `${r2} ${y2} ${b2}`;

  swatchTimer && clearTimeout(swatchTimer);
  const time = bypassTimer ? 0 : 1000;
  swatchTimer = setTimeout(() => {
    // get both names
    fetch(`https://api.color.pizza/v1/${hex.slice(1)}`, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        $swatchRGB.querySelector(".swatch__name")!.textContent =
          data.colors[0].name;
      });

    fetch(`https://api.color.pizza/v1/${hexRYB.slice(1)}`, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        $swatchRYB.querySelector(".swatch__name")!.textContent =
          data.colors[0].name;
      });
  }, time);
}

// generate a well saturated color
let swatchColorHSL = [Math.random() * 360, 0.2 + Math.random() * .8, 0.85 + Math.random() * .1] as ColorCoords;

$swatchRGBinput.addEventListener("input", (e) => {
  const $target = e.target;
  if (!($target instanceof HTMLInputElement)) {
    return;
  }
  const value = $target.value;
  setSwatchColor(hexToRgb(value));
});

setSwatchColor(rybHsl2rgb(swatchColorHSL), true);

const repaint = () => {
  setSwatchColor(hexToRgb($swatchRGBinput.value));

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

  for (let i = 0; i <= lightnessSteps; i++) {
    const colors = getColorsHSL(36, 0.4, 0.2 + (i / lightnessSteps) * 0.7);
    document.documentElement.style.setProperty(
      `--gradient-l${i}`,
      colors.join(),
    );
  }

  for (let i = 0; i < 36; i++) {
    const color = formatCSS(
      rybHsl2rgb([((i + 1) / 36) * 360, 1, 0.5], {
        cube: currentCube,
      }),
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
    formatCSS(currentCube[0]),
  );
  document.documentElement.style.setProperty(
    "--black",
    formatCSS(currentCube[7]),
  );
  document.documentElement.style.setProperty(
    "--red",
    formatCSS(currentCube[1]),
  );
  document.documentElement.style.setProperty(
    "--yellow",
    formatCSS(currentCube[2]),
  );
  document.documentElement.style.setProperty(
    "--orange",
    formatCSS(currentCube[3]),
  );
  document.documentElement.style.setProperty(
    "--blue",
    formatCSS(currentCube[4]),
  );
  document.documentElement.style.setProperty(
    "--pink",
    formatCSS(currentCube[5]),
  );
  document.documentElement.style.setProperty(
    "--green",
    formatCSS(currentCube[6]),
  );

  $w.value = rgbToHex(currentCube[0]);
  $r.value = rgbToHex(currentCube[1]);
  $y.value = rgbToHex(currentCube[2]);
  $o.value = rgbToHex(currentCube[3]);
  $b.value = rgbToHex(currentCube[4]);
  $v.value = rgbToHex(currentCube[5]);
  $g.value = rgbToHex(currentCube[6]);
  $black.value = rgbToHex(currentCube[7]);

  logCube(currentCube);

  const stairs = colorStairs(4, 10);
  const gradient = colorStairArrToGradient(stairs);

  generateColorSection(stairs, gradient);
  clearTimeout(timer!);
  timer = setTimeout(() => {
    createRamps();
  }, 1000);
};

repaint();

const els = [$w, $r, $y, $o, $b, $v, $g, $black];

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
    currentCube[index] = hexToRgb(value);
    repaint();
  }
});

const $select = document.createElement("select");
// create an option for each of the cubes
for (const [key, obj] of cubes) {
  const $option = document.createElement("option");
  $option.value = key;
  $option.textContent = obj.title;
  $select.appendChild($option);
}

$select.classList.add("select");

document.querySelector("body")!.appendChild($select);

$select.addEventListener("change", (e) => {
  const $target = e.target;
  if (!($target instanceof HTMLSelectElement)) {
    return;
  }
  const value = $target.value;
  const cube = cubes.get(value);
  if (cube) {
    currentCube = cube.cube;
    repaint();
  }
});
