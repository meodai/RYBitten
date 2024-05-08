export type ColorCoords = [number, number, number];
export type ColorCube = ColorCoords[] & { length: 8 };
export type CubesMap = Map<
  string,
  { title: string; reference: string; year: number; cube: ColorCube }
>;

export const RYB_ITTEN: ColorCube = [
  // black
  [29 / 255, 28 / 255, 28 / 255],

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

  // white
  [253 / 255, 246 / 255, 237 / 255],
];

export const RYB_ITTEN_ALT: ColorCube = [
  [29 / 255, 28 / 255, 28 / 255],
  [247 / 255, 45 / 255, 41 / 255],
  [253 / 255, 203 / 255, 0 / 255],
  [250 / 255, 102 / 255, 13 / 255],
  [17 / 255, 97 / 255, 170 / 255],
  [101 / 255, 57 / 255, 138 / 255],
  [70 / 255, 139 / 255, 73 / 255],
  [253 / 255, 246 / 255, 237 / 255],
];

export const RYB_ITTEN_NEUTRAL: ColorCube = [
  [0.2, 0.094, 0.0],
  [1, 1, 0],
  [1, 0, 0],
  [1, 0.5, 0],
  [0.163, 0.373, 0.6],
  [0.0, 0.66, 0.2],
  [0.5, 0.0, 0.5],
  [1, 1, 1],
];

export const RYB_BEZOLD: ColorCube = [
  [44 / 255, 37 / 255, 30 / 255],
  [170 / 255, 14 / 255, 1 / 255],
  [224 / 255, 178 / 255, 0 / 255],
  [217 / 255, 104 / 255, 5 / 255],
  [18 / 255, 107 / 255, 145 / 255],
  [103 / 255, 15 / 255, 128 / 255],
  [88 / 255, 133 / 255, 30 / 255],
  [245 / 255, 238 / 255, 226 / 255],
];

export const RYB_BOUTET: ColorCube = [
  [24 / 255, 10 / 255, 1 / 255],
  [237 / 255, 55 / 255, 58 / 255],
  [255 / 255, 233 / 255, 111 / 255],
  [250 / 255, 102 / 255, 13 / 255],
  [33 / 255, 112 / 255, 163 / 255],
  [238 / 255, 131 / 255, 154 / 255],
  [59 / 255, 155 / 255, 83 / 255],
  [254 / 255, 250 / 255, 226 / 255],
];

export const RYB_HETT: ColorCube = [
  [8 / 255, 8 / 255, 8 / 255],
  [218 / 255, 105 / 255, 104 / 255],
  [255 / 255, 244 / 255, 122 / 255],
  [232 / 255, 154 / 255, 113 / 255],
  [73 / 255, 138 / 255, 186 / 255],
  [97 / 255, 96 / 255, 178 / 255],
  [144 / 255, 191 / 255, 140 / 255],
  [255 / 255, 255 / 255, 255 / 255],
];

export const RYB_SCHIFFERMUELLER: ColorCube = [
  [55 / 255, 39 / 255, 23 / 255],
  [204 / 255, 50 / 255, 53 / 255],
  [253 / 255, 222 / 255, 20 / 255],
  [230 / 255, 152 / 255, 92 / 255],
  [1 / 255, 88 / 255, 140 / 255],
  [107 / 255, 51 / 255, 111 / 255],
  [51 / 255, 138 / 255, 92 / 255],
  [240 / 255, 234 / 255, 214 / 255],
];

export const RYB_HARRIS: ColorCube = [
  [14 / 255, 8 / 255, 7 / 255],
  [216 / 255, 43 / 255, 59 / 255],
  [231 / 255, 175 / 255, 2 / 255],
  [224 / 255, 89 / 255, 31 / 255],
  [92 / 255, 123 / 255, 145 / 255],
  [77 / 255, 58 / 255, 78 / 255],
  [107 / 255, 129 / 255, 53 / 255],
  [249 / 255, 232 / 255, 209 / 255],
];

export const RYB_GOETHE: ColorCube = [
  [8 / 255, 9 / 255, 13 / 255],
  [182 / 255, 53 / 255, 55 / 255],
  [253 / 255, 203 / 255, 0 / 255],
  [222 / 255, 69 / 255, 20 / 255],
  [95 / 255, 157 / 255, 191 / 255],
  [83 / 255, 70 / 255, 98 / 255],
  [58 / 255, 90 / 255, 66 / 255],
  [239 / 255, 235 / 255, 225 / 255],
];

export const RYB_MUNSELL: ColorCube = [
  [46 / 255, 44 / 255, 38 / 255],
  [181 / 255, 65 / 255, 60 / 255],
  [229 / 255, 193 / 255, 81 / 255],
  [220 / 255, 137 / 255, 61 / 255],
  [59 / 255, 143 / 255, 171 / 255],
  [121 / 255, 97 / 255, 134 / 255],
  [13 / 255, 170 / 255, 114 / 255],
  [228 / 255, 218 / 255, 197 / 255],
];

export const RYB_HAYER: ColorCube = [
  [44 / 255, 44 / 255, 37 / 255],
  [167 / 255, 33 / 255, 28 / 255],
  [245 / 255, 181 / 255, 18 / 255],
  [204 / 255, 93 / 255, 46 / 255],
  [71 / 255, 122 / 255, 141 / 255],
  [99 / 255, 79 / 255, 93 / 255],
  [109 / 255, 143 / 255, 118 / 255],
  [237 / 255, 213 / 255, 177 / 255],
];

// contemporary

export const RYB_IPPSKETCH: ColorCube = [
  [38/255,38/255,38/255],
  [196/255,82/255,69/255],
  [196/255,167/255,80/255],
  [200/255,123/255,70/255],
  [74/255,104/255,167/255],
  [94/255,89/255,161/255],
  [86/255,139/255,70/255],
  [221/255,219/255,211/255]
]


const cubes: CubesMap = new Map();

cubes.set("itten", {
  title: "Johannes Itten: Chromatic Circle",
  year: 1961,
  reference: "farbkreis_extended.png",
  cube: RYB_ITTEN,
});

cubes.set("itten-normalized", {
  title: "Johannes Itten: Chromatic Circle (Normalized)",
  year: 1961,
  reference:
    "Johannes-Itten-The-chromatic-circle-some-exercises-on-the-contrast-of-pure-colors.webp",
  cube: RYB_ITTEN_ALT,
});

cubes.set("itten-neutral", {
  title: "Johannes Itten: Nathan Gossett & Baoquan Chen",
  year: 1961,
  reference: "itten-ryb.pdf",
  cube: RYB_ITTEN_NEUTRAL,
});

cubes.set("bezold", {
  title: "Wilhelm von Bezold: Farbentafel",
  year: 1874,
  reference: "Bezold_Farbentafel_1874.jpg",
  cube: RYB_BEZOLD,
});

cubes.set("boutet", {
  title: "Claude Boutet: Twelve-color color circles ",
  year: 1708,
  reference: "Boutet_1708_color_circles.jpg",
  cube: RYB_BOUTET,
});

cubes.set("hett", {
  title: "J. A. H. Hett: RGV Color Wheel",
  year: 1908,
  reference: "RGV_color_wheel_1908",
  cube: RYB_HETT,
});

cubes.set("schiffermueller", {
  title: "Ignaz Schiffermüller: Versuch eines Farbensystems",
  year: 1772,
  reference: "020_schiffermueller1.jpg",
  cube: RYB_SCHIFFERMUELLER,
});

cubes.set("harris", {
  title: "Harris: The Natural System of Colours",
  year: 1766,
  reference: "Moses_Harris_The_Natural_System_of_Colours.jpg",
  cube: RYB_HARRIS,
});

cubes.set("goethe", {
  title: "Goethe: Farbenkreis",
  year: 1809,
  reference:
    "Goethe_Farbenkreis_zur_Symbolisierung_des_menschlichen_Geistes-_und_Seelenlebens_1809.jpg",
  cube: RYB_GOETHE,
});

cubes.set("munsell", {
  title: "Munsell Color System",
  year: 1905,
  reference: "munsell-atlas-11.jpg",
  cube: RYB_MUNSELL,
});

cubes.set("hayer", {
  title:
    "Charles Hayter:  New Practical Treatise on the Three Primitive Colours",
  year: 1826,
  reference: "Color_diagram_Charles_Hayter.jpg",
  cube: RYB_HAYER,
});

cubes.set("ippsketch", {
  title: "Ippsketch: imposter syndrome",
  year: 2021,
  reference: "ippsketch.png",
  cube: RYB_IPPSKETCH,
});

cubes.set("rgb", {
  title: "James Clerk Maxwell: RGB",
  year: 1860,
  reference: "rgb-cube.png",
  cube: [
    [0, 0, 0],
    [1, 0, 0],
    [1, 1, 0],
    [1, 0.5, 0],
    [0, 0, 1],
    [1, 0, 1],
    [0, 1, 0],
    [1, 1, 1],
  ],
});

export { cubes };
