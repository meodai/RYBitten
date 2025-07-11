/**
 * Represents a color in RGB/HSX... space as an array of three numbers.
 * @typedef {[number, number, number]} ColorCoords
 */
export type ColorCoords = [number, number, number];

/**
 * Represents a color cube with exactly 8 RGB colors for RYB to RGB mapping.
 * The colors are ordered as: white, red, yellow, orange, blue, violet, green, black
 * @typedef {ColorCoords[] & { length: 8 }} ColorCube
 */
export type ColorCube = ColorCoords[] & { length: 8 };

/**
 * Map storing historical and modern color cube definitions with their metadata.
 * @typedef {Map<string, {
 *   title: string,
 *   author: string,
 *   reference: string,
 *   year: number,
 *   cube: ColorCube
 * }>} CubesMap
 */
export type CubesMap = Map<
  string,
  {
    title: string;
    author: string;
    reference: string;
    year: number;
    cube: ColorCube;
  }
>;

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

const RYB_ITTEN_ALT: ColorCube = [
  [253 / 255, 246 / 255, 237 / 255],
  [247 / 255, 45 / 255, 41 / 255],
  [253 / 255, 203 / 255, 0 / 255],
  [250 / 255, 102 / 255, 13 / 255],
  [17 / 255, 97 / 255, 170 / 255],
  [101 / 255, 57 / 255, 138 / 255],
  [70 / 255, 139 / 255, 73 / 255],
  [29 / 255, 28 / 255, 28 / 255],
];

const RYB_ITTEN_NEUTRAL: ColorCube = [
  [1, 1, 1],
  [1, 0, 0],
  [1, 1, 0],
  [1, 0.5, 0],
  [0.163, 0.373, 0.6],
  [0.5, 0.0, 0.5],
  [0.0, 0.66, 0.2],
  [0.2, 0.094, 0.0],
];

const RYB_BEZOLD: ColorCube = [
  [245 / 255, 238 / 255, 226 / 255],
  [170 / 255, 14 / 255, 1 / 255],
  [224 / 255, 178 / 255, 0 / 255],
  [217 / 255, 104 / 255, 5 / 255],
  [18 / 255, 107 / 255, 145 / 255],
  [103 / 255, 15 / 255, 128 / 255],
  [88 / 255, 133 / 255, 30 / 255],
  [44 / 255, 37 / 255, 30 / 255],
];

const RYB_BOUTET: ColorCube = [
  [254 / 255, 250 / 255, 226 / 255],
  [237 / 255, 55 / 255, 58 / 255],
  [255 / 255, 233 / 255, 111 / 255],
  [250 / 255, 102 / 255, 13 / 255],
  [33 / 255, 112 / 255, 163 / 255],
  [238 / 255, 131 / 255, 154 / 255],
  [59 / 255, 155 / 255, 83 / 255],
  [24 / 255, 10 / 255, 1 / 255],
];

const RYB_HETT: ColorCube = [
  [255 / 255, 255 / 255, 255 / 255],
  [218 / 255, 105 / 255, 104 / 255],
  [255 / 255, 244 / 255, 122 / 255],
  [232 / 255, 154 / 255, 113 / 255],
  [73 / 255, 138 / 255, 186 / 255],
  [97 / 255, 96 / 255, 178 / 255],
  [144 / 255, 191 / 255, 140 / 255],
  [8 / 255, 8 / 255, 8 / 255],
];

const RYB_SCHIFFERMUELLER: ColorCube = [
  [240 / 255, 234 / 255, 214 / 255],
  [204 / 255, 50 / 255, 53 / 255],
  [253 / 255, 222 / 255, 20 / 255],
  [230 / 255, 152 / 255, 92 / 255],
  [1 / 255, 88 / 255, 140 / 255],
  [107 / 255, 51 / 255, 111 / 255],
  [51 / 255, 138 / 255, 92 / 255],
  [55 / 255, 39 / 255, 23 / 255],
];

const RYB_HARRIS: ColorCube = [
  [249 / 255, 232 / 255, 209 / 255],
  [216 / 255, 43 / 255, 59 / 255],
  [231 / 255, 175 / 255, 2 / 255],
  [224 / 255, 89 / 255, 31 / 255],
  [92 / 255, 123 / 255, 145 / 255],
  [77 / 255, 58 / 255, 78 / 255],
  [107 / 255, 129 / 255, 53 / 255],
  [14 / 255, 8 / 255, 7 / 255],
];

const RYB_HARRISC82: ColorCube = [
  // white
  [241 / 255, 236 / 255, 213 / 255],

  // red
  [235 / 255, 66 / 255, 35 / 255],

  // yellow
  [253 / 255, 236 / 255, 1 / 255],

  // orange
  [254 / 255, 130 / 255, 39 / 255],

  // blue
  [3 / 255, 7 / 255, 171 / 255],

  // pink / but often violet in old color wheels
  [74 / 255, 50 / 255, 86 / 255],

  // green
  [55 / 255, 131 / 255, 74 / 255],

  // black
  [2 / 255, 1 / 255, 0 / 255],
];

const RYB_HARRISC82_ALT: ColorCube = [
  [238 / 255, 232 / 255, 206 / 255],
  [222 / 255, 62 / 255, 29 / 255],
  [247 / 255, 225 / 255, 7 / 255],
  [254 / 255, 130 / 255, 39 / 255],
  [4 / 255, 6 / 255, 139 / 255],
  [74 / 255, 50 / 255, 86 / 255],
  [56 / 255, 131 / 255, 75 / 255],
  [2 / 255, 1 / 255, 0 / 255],
];

const RYB_GOETHE: ColorCube = [
  [239 / 255, 235 / 255, 225 / 255],
  [182 / 255, 53 / 255, 55 / 255],
  [253 / 255, 203 / 255, 0 / 255],
  [222 / 255, 69 / 255, 20 / 255],
  [95 / 255, 157 / 255, 191 / 255],
  [83 / 255, 70 / 255, 98 / 255],
  [58 / 255, 90 / 255, 66 / 255],
  [8 / 255, 9 / 255, 13 / 255],
];

const RYB_MUNSELL: ColorCube = [
  [228 / 255, 218 / 255, 197 / 255],
  [181 / 255, 65 / 255, 60 / 255],
  [229 / 255, 193 / 255, 81 / 255],
  [220 / 255, 137 / 255, 61 / 255],
  [59 / 255, 143 / 255, 171 / 255],
  [121 / 255, 97 / 255, 134 / 255],
  [13 / 255, 170 / 255, 114 / 255],
  [46 / 255, 44 / 255, 38 / 255],
];

const RYB_MUNSELL_ALT: ColorCube = [
  [206 / 255, 205 / 255, 209 / 255],
  [181 / 255, 38 / 255, 54 / 255],
  [221 / 255, 187 / 255, 23 / 255],
  [208 / 255, 120 / 255, 37 / 255],
  [10 / 255, 71 / 255, 129 / 255],
  [101 / 255, 36 / 255, 66 / 255],
  [75 / 255, 129 / 255, 131 / 255],
  [26 / 255, 30 / 255, 47 / 255],
];

const RYB_HAYTER: ColorCube = [
  [237 / 255, 213 / 255, 177 / 255],
  [167 / 255, 33 / 255, 28 / 255],
  [245 / 255, 181 / 255, 18 / 255],
  [204 / 255, 93 / 255, 46 / 255],
  [71 / 255, 122 / 255, 141 / 255],
  [99 / 255, 79 / 255, 93 / 255],
  [109 / 255, 143 / 255, 118 / 255],
  [44 / 255, 44 / 255, 37 / 255],
];

const RYB_BORMANN: ColorCube = [
  [240 / 255, 236 / 255, 235 / 255],
  [247 / 255, 65 / 255, 51 / 255],
  [243 / 255, 187 / 255, 6 / 255],
  [251 / 255, 130 / 255, 2 / 255],
  [37 / 255, 71 / 255, 169 / 255],
  [176 / 255, 121 / 255, 177 / 255],
  [2 / 255, 117 / 255, 111 / 255],
  [41 / 255, 42 / 255, 45 / 255],
];

const RYB_ALBERS: ColorCube = [
  [231 / 255, 235 / 255, 237 / 255],
  [229 / 255, 30 / 255, 38 / 255],
  [255 / 255, 198 / 255, 12 / 255],
  [245 / 255, 119 / 255, 34 / 255],
  [17 / 255, 97 / 255, 170 / 255],
  [139 / 255, 47 / 255, 146 / 255],
  [1 / 255, 167 / 255, 98 / 255],
  [0 / 255, 0 / 255, 1 / 255],
];

const RYB_LOHSE: ColorCube = [
  [236 / 255, 237 / 255, 241 / 255],
  [200 / 255, 75 / 255, 49 / 255],
  [235 / 255, 207 / 255, 13 / 255],
  [228 / 255, 168 / 255, 21 / 255],
  [39 / 255, 108 / 255, 176 / 255],
  [188 / 255, 57 / 255, 104 / 255],
  [122 / 255, 176 / 255, 62 / 255],
  [4 / 255, 4 / 255, 4 / 255],
];

//Michel Eugène Chevreul / Cercle_chromatique / Cercle_chromatique_Chevreul_2.jpg
const RYB_CHEVREUL: ColorCube = [
  [241 / 255, 236 / 255, 230 / 255],
  [185 / 255, 34 / 255, 17 / 255],
  [231 / 255, 200 / 255, 52 / 255],
  [232 / 255, 90 / 255, 26 / 255],
  [26 / 255, 70 / 255, 79 / 255],
  [82 / 255, 15 / 255, 47 / 255],
  [67 / 255, 111 / 255, 33 / 255],
  [29 / 255, 28 / 255, 28 / 255],
];

// 1er cercle chromatique

const RYB_JAPSCHOOL: ColorCube = [
  [215 / 255, 208 / 255, 180 / 255],
  [202 / 255, 0 / 255, 17 / 255],
  [220 / 255, 170 / 255, 0 / 255],
  [229 / 255, 76 / 255, 32 / 255],
  [0 / 255, 126 / 255, 157 / 255],
  [137 / 255, 37 / 255, 79 / 255],
  [0 / 255, 110 / 255, 60 / 255],
  [31 / 255, 27 / 255, 28 / 255],
];

const RYB_KIDERGARTEN1890: ColorCube = [
  [236 / 255, 231 / 255, 213 / 255],
  [188 / 255, 32 / 255, 43 / 255],
  [233 / 255, 201 / 255, 0 / 255],
  [197 / 255, 72 / 255, 30 / 255],
  [50 / 255, 42 / 255, 115 / 255],
  [116 / 255, 48 / 255, 101 / 255],
  [69 / 255, 118 / 255, 61 / 255],
  [56 / 255, 44 / 255, 42 / 255],
];

// Maycock
const RYB_MAYCOCK: ColorCube = [
  [209 / 255, 194 / 255, 173 / 255],
  [159 / 255, 36 / 255, 31 / 255],
  [231 / 255, 191 / 255, 6 / 255],
  [231 / 255, 155 / 255, 7 / 255],
  [75 / 255, 90 / 255, 200 / 255],
  [121 / 255, 100 / 255, 188 / 255],
  [115 / 255, 179 / 255, 63 / 255],
  [52 / 255, 49 / 255, 40 / 255],
];

const RYB_COLORPRINTER: ColorCube = [
  [250 / 255, 248 / 255, 244 / 255],
  [255 / 255, 41 / 255, 37 / 255],
  [251 / 255, 223 / 255, 47 / 255],
  [253 / 255, 151 / 255, 35 / 255],
  [31 / 255, 106 / 255, 184 / 255],
  [159 / 255, 68 / 255, 150 / 255],
  [80 / 255, 180 / 255, 122 / 255],
  [36 / 255, 38 / 255, 39 / 255],
];

// Marvel Newsprint 1982

const RYB_MARVEL_NEWS: ColorCube = [
  [233 / 255, 199 / 255, 173 / 255],
  [214 / 255, 76 / 255, 127 / 255],
  [238 / 255, 204 / 255, 124 / 255],
  [230 / 255, 174 / 255, 115 / 255],
  [86 / 255, 141 / 255, 146 / 255],
  [118 / 255, 83 / 255, 97 / 255],
  [196 / 255, 192 / 255, 118 / 255],
  [60 / 255, 52 / 255, 40 / 255],
];

// Apple 1990 reference manual
const RYB_APPLE90s: ColorCube = [
  [255 / 255, 244 / 255, 216 / 255],
  [248 / 255, 80 / 255, 46 / 255],
  [255 / 255, 213 / 255, 44 / 255],
  [254 / 255, 129 / 255, 5 / 255],
  [0 / 255, 124 / 255, 197 / 255],
  [132 / 255, 77 / 255, 139 / 255],
  [120 / 255, 160 / 255, 66 / 255],
  [2 / 255, 4 / 255, 6 / 255],
];

// Apple Hyper Card User Manual 1989
const RYB_APPLE80s: ColorCube = [
  [254 / 255, 249 / 255, 246 / 255],
  [248 / 255, 20 / 255, 35 / 255],
  [237 / 255, 199 / 255, 8 / 255],
  [254 / 255, 128 / 255, 11 / 255],
  [48 / 255, 140 / 255, 206 / 255],
  [182 / 255, 40 / 255, 94 / 255],
  [135 / 255, 187 / 255, 26 / 255],
  [29 / 255, 27 / 255, 28 / 255],
];

// contemporary

const RYB_PixelArt: ColorCube = [
  [226 / 255, 216 / 255, 205 / 255],
  [224 / 255, 43 / 255, 39 / 255],
  [251 / 255, 204 / 255, 38 / 255],
  [255 / 255, 138 / 255, 4 / 255],
  [82 / 255, 103 / 255, 202 / 255],
  [199 / 255, 112 / 255, 253 / 255],
  [104 / 255, 182 / 255, 90 / 255],
  [22 / 255, 19 / 255, 11 / 255],
];

const RYB_IPPSKETCH: ColorCube = [
  [221 / 255, 219 / 255, 211 / 255],
  [196 / 255, 82 / 255, 69 / 255],
  [196 / 255, 167 / 255, 80 / 255],
  [200 / 255, 123 / 255, 70 / 255],
  [74 / 255, 104 / 255, 167 / 255],
  [94 / 255, 89 / 255, 161 / 255],
  [86 / 255, 139 / 255, 70 / 255],
  [38 / 255, 38 / 255, 38 / 255],
];

const RYB_RYAN: ColorCube = [
  [237 / 255, 235 / 255, 236 / 255],
  [242 / 255, 146 / 255, 109 / 255],
  [245 / 255, 234 / 255, 143 / 255],
  [247 / 255, 194 / 255, 115 / 255],
  [89 / 255, 118 / 255, 212 / 255],
  [237 / 255, 191 / 255, 243 / 255],
  [153 / 255, 201 / 255, 113 / 255],
  [50 / 255, 63 / 255, 66 / 255],
];

const RYB_TEN: ColorCube = [
  [255 / 255, 251 / 255, 230 / 255],
  [238 / 255, 86 / 255, 46 / 255],
  [249 / 255, 213 / 255, 50 / 255],
  [252 / 255, 132 / 255, 4 / 255],
  [43 / 255, 103 / 255, 175 / 255],
  [246 / 255, 137 / 255, 163 / 255],
  [171 / 255, 205 / 255, 94 / 255],
  [5 / 255, 5 / 255, 5 / 255],
];

const RYB_CLAYTON: ColorCube = [
  [246 / 255, 248 / 255, 244 / 255],
  [248 / 255, 20 / 255, 40 / 255],
  [255 / 255, 198 / 255, 8 / 255],
  [248 / 255, 140 / 255, 18 / 255],
  [8 / 255, 41 / 255, 148 / 255],
  [152 / 255, 56 / 255, 142 / 255],
  [8 / 255, 156 / 255, 49 / 255],
  [12 / 255, 17 / 255, 15 / 255],
];

/**
 * Collection of historical and contemporary RYB color cube definitions.
 * Each cube is based on different color theories and historical works.
 * Includes cubes from:
 * - Historical color theorists (Itten, Goethe, Munsell, etc.)
 * - Contemporary sources (Apple manuals, Marvel comics)
 * - Modern digital artists (Ippsketch, etc.)
 *
 * Each entry contains:
 * - title: Name of the color system/work
 * - author: Creator of the color system
 * - year: Year of creation
 * - reference: Reference image filename
 * - cube: The actual color values as RGB coordinates
 */

const cubes: CubesMap = new Map();

cubes.set("itten", {
  title: "Chromatic Circle",
  author: "Johannes Itten",
  year: 1961,
  reference: "farbkreis_extended.png",
  cube: RYB_ITTEN,
});

cubes.set("itten-normalized", {
  title: "Chromatic Circle (Paper-white)",
  author: "Johannes Itten",
  year: 1961,
  reference:
    "Johannes-Itten-The-chromatic-circle-some-exercises-on-the-contrast-of-pure-colors.webp",
  cube: RYB_ITTEN_ALT,
});

cubes.set("itten-neutral", {
  title: "Nathan Gossett & Baoquan Chen",
  author: "Johannes Itten",
  year: 1961,
  reference: "itten-ryb.pdf",
  cube: RYB_ITTEN_NEUTRAL,
});

cubes.set("bezold", {
  title: "Farbentafel",
  author: "Wilhelm von Bezold",
  year: 1874,
  reference: "Bezold_Farbentafel_1874.jpg",
  cube: RYB_BEZOLD,
});

cubes.set("boutet", {
  title: "Twelve-color color circles ",
  author: "Claude Boutet",
  year: 1708,
  reference: "Boutet_1708_color_circles.jpg",
  cube: RYB_BOUTET,
});

cubes.set("hett", {
  title: "RGV Color Wheel",
  author: "J. A. H. Hett",
  year: 1908,
  reference: "RGV_color_wheel_1908",
  cube: RYB_HETT,
});

cubes.set("schiffermueller", {
  title: "Versuch eines Farbensystems",
  author: "Ignaz Schiffermüller",
  year: 1772,
  reference: "020_schiffermueller1.jpg",
  cube: RYB_SCHIFFERMUELLER,
});

cubes.set("harris", {
  title: "The Natural System of Colours",
  author: "Moses Harris",
  year: 1766,
  reference: "Moses_Harris_The_Natural_System_of_Colours.jpg",
  cube: RYB_HARRIS,
});

cubes.set("harrisc82", {
  title: "The Natural System of Colours",
  author: "Moses Harris / C82",
  year: 1766,
  reference: "harrisc82.png",
  cube: RYB_HARRISC82,
});

cubes.set("harrisc82alt", {
  title: "The Natural System of Colours",
  author: "Moses Harris / C82",
  year: 1766,
  reference: "harrisc82alt.png",
  cube: RYB_HARRISC82_ALT,
});

cubes.set("goethe", {
  title: "Farbenkreis",
  author: "Johann Wolfgang von Goethe",
  year: 1809,
  reference:
    "Goethe_Farbenkreis_zur_Symbolisierung_des_menschlichen_Geistes-_und_Seelenlebens_1809.jpg",
  cube: RYB_GOETHE,
});

cubes.set("munsell", {
  title: "Munsell Color System",
  author: "Albert Henry Munsell",
  year: 1905,
  reference: "munsell-atlas-11.jpg",
  cube: RYB_MUNSELL,
});

cubes.set("munsell-alt", {
  title: "A Grammar of Color",
  author: "Cleland, T. M. & Albert Henry Munsell",
  year: 1921,
  reference: "munsell-alt.jpg",
  cube: RYB_MUNSELL_ALT,
});

cubes.set("hayter", {
  title: "New Practical Treatise on the Three Primitive Colours",
  author: "Charles Hayter",
  year: 1826,
  reference: "Color_diagram_Charles_Hayter.jpg",
  cube: RYB_HAYTER,
});

cubes.set("bormann", {
  title: "Gouache tint study for Josef Alber's Preliminary Course",
  author: "Heinrich-Siegfried Bormann",
  year: 1931,
  reference: "bormann.png",
  cube: RYB_BORMANN,
});

cubes.set("albers", {
  title: "Interaction of Color",
  author: "Josef Albers",
  year: 1942,
  reference: "albers-color-harmony.jpg",
  cube: RYB_ALBERS,
});

cubes.set("lohse", {
  title: "Kunsthalle Bern Poster",
  author: "Richard Paul Lohse",
  year: 1970,
  reference: "lohse.png",
  cube: RYB_LOHSE,
});

cubes.set("chevreul", {
  title: "Cercle chromatique",
  author: "Michel Eugène Chevreul",
  year: 1839,
  reference: "Cercle_chromatique_Chevreul_2.jpg",
  cube: RYB_CHEVREUL,
});

cubes.set("maycock", {
  title: "Scale of Normal Colors and their Hues",
  author: "Mark M. Maycock",
  year: 1895,
  reference: "maycock.png",
  cube: RYB_MAYCOCK,
});

cubes.set("colorprinter", {
  title: "The Color Printer",
  author: "John Earhart",
  year: 1892,
  reference: "colorprinter.png",
  cube: RYB_COLORPRINTER,
});

cubes.set("japschool", {
  title: "Japanese Textbook",
  author: "Japanese School",
  year: 1930,
  reference: "japschool.png",
  cube: RYB_JAPSCHOOL,
});

cubes.set("kindergarten1890", {
  title: "Kindergarten Workbook",
  author: "Milton Bradley",
  year: 1890,
  reference: "kindergarten1890.jpg",
  cube: RYB_KIDERGARTEN1890,
});

cubes.set("marvel-news", {
  title: "64 Color Chart on Newsprint",
  author: "Marvel Comics",
  year: 1982,
  reference: "marvel-news.png",
  cube: RYB_MARVEL_NEWS,
});

cubes.set("apple90s", {
  title: "Macintosh Reference Manual",
  author: "Apple",
  year: 1990,
  reference: "apple90s.png",
  cube: RYB_APPLE90s,
});

cubes.set("apple80s", {
  title: "HyperCard User Manual",
  author: "Apple",
  year: 1989,
  reference: "apple80s.png",
  cube: RYB_APPLE80s,
});

cubes.set("clayton", {
  title: "Intrinsic Value Plate",
  author: "Greg Clayton",
  year: 2017,
  reference: "A260P03_IntrinsicValue1.gif",
  cube: RYB_CLAYTON,
});

// mordern

cubes.set("pixelart", {
  title: "Pixel Art",
  author: "Tofu",
  year: 2024,
  reference: "pixelart.png",
  cube: RYB_PixelArt,
});

cubes.set("ippsketch", {
  title: "Imposter Syndrome",
  author: "Ippsketch",
  year: 2021,
  reference: "ippsketch.png",
  cube: RYB_IPPSKETCH,
});

cubes.set("ryan", {
  title: "Compositions Palette",
  author: "Ryan",
  year: 2024,
  reference: "ryan.png",
  cube: RYB_RYAN,
});

cubes.set("ten", {
  title: "Ten",
  author: "Roni Kaufman",
  year: 2022,
  reference: "ten.png",
  cube: RYB_TEN,
});

cubes.set("rgb", {
  title: "Inverted RGB",
  author: "James Clerk Maxwell",
  year: 1860,
  reference: "rgb-cube.png",
  cube: [
    [1, 1, 1],
    [1, 0, 0],
    [0, 1, 0],
    [1, 1, 0],
    [0, 0, 1],
    [1, 0, 1],
    [0, 1, 1],
    [0, 0, 0],
  ],
});

export { cubes };
