export const colorsToGradient = (cls: string[], hardStops = false): string =>
  cls
    .map(
      (c, i) =>
        {
          if (hardStops) {
            return `${c} ${(i / cls.length) * 100}% ${((i + 1) / cls.length) * 100}%`
          }
          return `${c} ${(i / cls.length) * 100}%`
        }
    )
    .join();