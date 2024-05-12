import { derived, writable } from "svelte/store";
import type {Writable} from "svelte/store";

import { cubes } from "rybitten";
import type { CubesMap, ColorCube } from "rybitten";

type CubesMapEntry = {
    title: string;
    reference: string;
    year: number;
    cube: ColorCube;
};

class CurrentColors {
  constructor(
    public currentPreset: Writable<CubesMapEntry> = writable(cubes.get('itten-normalized')),
  ) {}
  
  get cube () {
    return derived(this.currentPreset, $currentPreset => $currentPreset.cube);
  }
}

export const currentColors = new CurrentColors();