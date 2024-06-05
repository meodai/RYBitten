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
  public currentPresetUid: string;

  constructor(
  ) {
    this.currentPreset = writable(cubes.get('itten-normalized')!);
    this.isCustom = writable(false);
    this.customCube = writable([...cubes.get('itten-normalized')!.cube] as ColorCube);
    this.currentPresetUid = 'itten-normalized';
  }
  
  get cube () {
    return derived(
      [this.currentPreset, this.customCube, this.isCustom], 
      ([$currentPreset, $customCube, $isCustom]) => {
        if ($isCustom) {
          return $customCube;
        } else {
          return $currentPreset.cube;
        }
      }
    );
  }

  set cube (cube: ColorCube) {
    this.customCube.set(cube);
    this.isCustom.set(true);
    this.currentPresetUid = 'custom';
  }

  set preset (preset: string) {
    this.currentPreset.set(cubes.get(preset)!);
    this.isCustom.set(false);
    this.currentPresetUid = preset;
  }

  get presets () {
    return cubes;
  }
}

export const currentColors = new CurrentColors();