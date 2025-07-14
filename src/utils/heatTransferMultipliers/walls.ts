import { interpolateHeatTransferMultiplier } from "./interpolationUtils";

import { wallHeatTransferMultipliers as wallData } from "@/data/heatTransferMultipliers/walls";

const buildWallComponentMap = (() => {
  let cacheBuilt = false;
  const wallCache = new Map<
    string,
    Map<
      string,
      { uFactor: number; htmByTemperature: { [key: number]: number } }
    >
  >();

  return () => {
    if (cacheBuilt) return wallCache;

    for (const entry of wallData) {
      let sheathingMap = wallCache.get(entry.cavityInsulation);
      if (!sheathingMap) {
        sheathingMap = new Map();
        wallCache.set(entry.cavityInsulation, sheathingMap);
      }

      sheathingMap.set(entry.sheathing, {
        uFactor: entry.uFactor,
        htmByTemperature: entry.htmByTemperature,
      });
    }

    cacheBuilt = true;
    return wallCache;
  };
})();

export function getCavityInsulationTypes(): string[] {
  const wallMap = buildWallComponentMap();
  return Array.from(wallMap.keys());
}

export function getSheathingTypesForCavityInsulation(
  cavityInsulation: string,
): string[] {
  const wallMap = buildWallComponentMap();
  const sheathingMap = wallMap.get(cavityInsulation);
  return sheathingMap ? Array.from(sheathingMap.keys()) : [];
}

export function getWallData(
  cavityInsulation: string,
  sheathing: string,
): { uFactor: number; htmByTemperature: { [key: number]: number } } | null {
  const wallMap = buildWallComponentMap();
  const sheathingMap = wallMap.get(cavityInsulation);
  if (!sheathingMap) return null;

  const wallData = sheathingMap.get(sheathing);
  return wallData || null;
}

export function calculateWallHeatTransferMultiplier(
  cavityInsulation: string,
  sheathing: string,
  tempDifference: number,
): number | null {
  const wallData = getWallData(cavityInsulation, sheathing);
  if (wallData === null) return null;

  const { uFactor, htmByTemperature } = wallData;
  return interpolateHeatTransferMultiplier(
    htmByTemperature,
    tempDifference,
    uFactor,
  );
}
