import "./demo.css";
import { rybHsl2rgb, ryb2rgb } from "./main";
import { ColorCoords, ColorCube, cubes } from "./cubes";

let currentCube: ColorCube = cubes.get("itten-normalized")!.cube;

const logCube = (cube: ColorCube) => {
  console.log("Customized RYB_CUBE");
  console.log(cube.map((row) => row.map((it) => it * 255 + "/255")));
};

const formatCSS = (rgb: ColorCoords): string => {
  return `rgb(${Math.round(rgb[0] * 255)} ${Math.round(rgb[1] * 255)} ${Math.round(rgb[2] * 255)})`;
};

/*
function sRGBtoLin(colorChannel: number): number {
  // Send this function a decimal sRGB gamma encoded color value
  // between 0.0 and 1.0, and it returns a linearized value.

  if ( colorChannel <= 0.04045 ) {
    return colorChannel / 12.92;
  } else {
    return Math.pow((( colorChannel + 0.055)/1.055),2.4);
  }
}

function rgbToLuminance(rgb: ColorCoords): number {
  // Convert RGB to luminance (Y component)
  // https://en.wikipedia.org/wiki/Relative_luminance
  const [r, g, b] = rgb.map(sRGBtoLin);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function YtoLstar(Y: number): number {
  // Send this function a luminance value between 0.0 and 1.0,
  // and it returns L* which is "perceptual lightness"
  if ( Y <= (216/24389)) {       // The CIE standard states 0.008856 but 216/24389 is the intent for 0.008856451679036
    return Y * (24389/27);  // The CIE standard states 903.3, but 24389/27 is the intent, making 903.296296296296296
  }
  return Math.pow(Y,(1/3)) * 116 - 16;
}

function rgbToLstar(rgb: ColorCoords): number {
  return YtoLstar(rgbToLuminance(rgb));
}*/

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
      const activeIndex = 1 + Math.floor(Math.random() * (ramp.length - 2));
      return `<div class="ramp">
      <h2>${romanNumerals[i + 1]}</h2>
      ${ramp
        .map((hex, j) => {
          const activeClass = j === activeIndex ? "ramp__step--active" : "";
          return `<div class="ramp__step ${activeClass}" style="--c: ${hex}; --rnd: ${-1 + Math.random() * 2}; --rnd2: ${Math.random()};">
            <div class="ramp__inner">
              <div class="ramp__label">
                <span>${namesForHexes[hex]}</span>
                <span>${hex}</span>
              </div>
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

const $w2 = document.querySelector('[data-c2="w"]') as HTMLInputElement;
const $r2 = document.querySelector('[data-c2="r"]') as HTMLInputElement;
const $y2 = document.querySelector('[data-c2="y"]') as HTMLInputElement;
const $o2 = document.querySelector('[data-c2="o"]') as HTMLInputElement;
const $b2 = document.querySelector('[data-c2="b"]') as HTMLInputElement;
const $v2 = document.querySelector('[data-c2="v"]') as HTMLInputElement;
const $g2 = document.querySelector('[data-c2="g"]') as HTMLInputElement;
const $black2 = document.querySelector('[data-c2="0"]') as HTMLInputElement;

$w.parentElement!.style.setProperty("--c", `var(--white)`);
$r.parentElement!.style.setProperty("--c", `var(--red)`);
$y.parentElement!.style.setProperty("--c", `var(--yellow)`);
$o.parentElement!.style.setProperty("--c", `var(--orange)`);
$b.parentElement!.style.setProperty("--c", `var(--blue)`);
$v.parentElement!.style.setProperty("--c", `var(--pink)`);
$g.parentElement!.style.setProperty("--c", `var(--green)`);
$black.parentElement!.style.setProperty("--c", `var(--black)`);

$w2.parentElement!.style.setProperty("--c", `var(--white)`);
$r2.parentElement!.style.setProperty("--c", `var(--red)`);
$y2.parentElement!.style.setProperty("--c", `var(--yellow)`);
$o2.parentElement!.style.setProperty("--c", `var(--orange)`);
$b2.parentElement!.style.setProperty("--c", `var(--blue)`);
$v2.parentElement!.style.setProperty("--c", `var(--pink)`);
$g2.parentElement!.style.setProperty("--c", `var(--green)`);
$black2.parentElement!.style.setProperty("--c", `var(--black)`);

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
    fetch(`https://api.color.pizza/v1/?values=${hex.slice(1)}&list=bestOf`, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        $swatchRGB.querySelector(".swatch__name")!.textContent =
          data.colors[0].name;
      });

    fetch(`https://api.color.pizza/v1/?values=${hexRYB.slice(1)}&list=bestOf`, {
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
let swatchColorHSL = [
  Math.random() * 360,
  0.2 + Math.random() * 0.8,
  0.85 + Math.random() * 0.1,
] as ColorCoords;

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
  /*
  document.documentElement.style.setProperty(
    "--gradient",
    colors.map(c => {
      const [r, g, b] = c.match(/\d+/g)!.map(Number);
      const lstar = rgbToLstar([r/255, g/255, b/255]);
      console.log(lstar)
      return `rgb(${Math.floor(lstar * 2.5)} ${Math.floor(lstar * 2.5)} ${Math.floor(lstar * 2.5)})`;
    }).join(),
  );*/

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

  $w2.value = rgbToHex(currentCube[0]);
  $r2.value = rgbToHex(currentCube[1]);
  $y2.value = rgbToHex(currentCube[2]);
  $o2.value = rgbToHex(currentCube[3]);
  $b2.value = rgbToHex(currentCube[4]);
  $v2.value = rgbToHex(currentCube[5]);
  $g2.value = rgbToHex(currentCube[6]);
  $black2.value = rgbToHex(currentCube[7]);

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
const els2 = [$w2, $r2, $y2, $o2, $b2, $v2, $g2, $black2];

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
  // mirror the color change on els2
  const $tarInEls2 = els2[index];
  $tarInEls2.value = value;
});

document.querySelector("[data-edges2]")?.addEventListener("input", (e) => {
  const $target = e.target;
  if (!($target instanceof HTMLInputElement)) {
    return;
  }
  const value = $target.value;
  const $tarInEls = els2.find(($el) => $el.isEqualNode($target));
  if (!$tarInEls) {
    return;
  }
  const index = els2.indexOf($tarInEls);
  if (index > -1) {
    currentCube[index] = hexToRgb(value);
    repaint();
  }
  // mirror the color change on els
  const $tarInEls1 = els[index];
  $tarInEls1.value = value;
});

/*
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
});*/

const $presetsList = document.querySelector("[data-presets]") as HTMLElement;
for (const [key, obj] of cubes) {
  const $li = document.createElement("li") as HTMLElement;
  const $label = document.createElement("label") as HTMLLabelElement;
  const $input = document.createElement("input") as HTMLInputElement;
  $input.type = "radio";
  $input.name = "preset";
  $input.value = key;
  $label.appendChild($input);

  const div = `
    <div>
      <h3>${obj.title} <span>${obj.year}</span></h3>
      <strong>${obj.author}</strong>
    </div>
  `;

  $label.innerHTML += div;
  $li.appendChild($label);
  $presetsList.appendChild($li);
}

(
  $presetsList.querySelector(
    "input[value='itten-normalized']",
  ) as HTMLInputElement
).checked = true;

$presetsList.addEventListener(
  "change",
  (e) => {
    const $target = e.target;
    if (!($target instanceof HTMLInputElement)) {
      return;
    }
    const value = $target.value;
    const cube = cubes.get(value);
    if (cube) {
      currentCube = cube.cube;
      repaint();
    }
  },
  true,
);
