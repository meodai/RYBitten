import { derived, get, writable } from "svelte/store";
import type { Writable } from "svelte/store";

import { cubes } from "rybitten";
import type { ColorCube } from "rybitten";

type CubesMapEntry = {
  title: string;
  reference: string;
  year: number;
  cube: ColorCube;
};

class CurrentColors {
  public currentPreset: Writable<CubesMapEntry>;
  public isCustom: Writable<boolean>;
  public customCube: Writable<ColorCube>;

  constructor(
  ) {
    this.currentPreset = writable(cubes.get('itten')!);
    this.isCustom = writable(false);
    this.customCube = writable([...cubes.get('itten')!.cube] as ColorCube);
  }
  
  get cube () {
    return derived(
      [this.currentPreset, this.customCube, this.isCustom], ([$currentPreset, $customCube, $isCustom]) => {
        if ($isCustom) {
          return $customCube;
        } else {
          return $currentPreset.cube;
        }
      }
    );
  }

  set preset (preset: string) {
    this.currentPreset.set(cubes.get(preset)!);
  }

  

  get presets () {
    return cubes;
  }
}

export const currentColors = new CurrentColors();