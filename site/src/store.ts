import { derived, writable } from "svelte/store";
import type { Writable } from "svelte/store";
import { cubes } from "rybitten";
import type { ColorCube } from "rybitten";

const devMode = writable(false);

type CubesMapEntry = {
  title: string;
  reference: string;
  year: number;
  cube: ColorCube;
};

const currentColors = (() => {
  const defaultPreset = cubes.get('itten-normalized');
  if (!defaultPreset) throw new Error("Default preset 'itten-normalized' not found.");

  const currentPreset = writable(defaultPreset);
  const isCustom = writable(false);
  const customCube = writable([...defaultPreset.cube] as ColorCube);
  let currentPresetUid = 'itten-normalized';

  const cube = derived(
    [currentPreset, customCube, isCustom],
    ([$currentPreset, $customCube, $isCustom]) => $isCustom ? $customCube : $currentPreset.cube
  );

  function setPreset(preset: string) {
    const presetCube = cubes.get(preset);
    if (presetCube) {
      currentPreset.set(presetCube);
      isCustom.set(false);
      currentPresetUid = preset;
    } else {
      console.error(`Preset ${preset} not found.`);
    }
  }

  function setCube(newCube: ColorCube) {
    customCube.set(newCube);
    isCustom.set(true);
    currentPresetUid = 'custom';
  }

  return { currentPreset, isCustom, customCube, currentPresetUid, cube, setPreset, setCube, presets: cubes };
})();

export { currentColors, devMode };
