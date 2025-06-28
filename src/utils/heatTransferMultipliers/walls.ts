import { wallHeatTransferMultipliers as wallData } from "@/data/heatTransferMultipliers/walls";

const buildWallComponentMap = (() => {
  let cacheBuilt = false;
  const wallCache = new Map<string, Map<string, { uFactor: number }>>();

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

export function getUFactorForWall(
  cavityInsulation: string,
  sheathing: string,
): number | null {
  const wallMap = buildWallComponentMap();
  const sheathingMap = wallMap.get(cavityInsulation);
  if (!sheathingMap) return null;

  const uFactorData = sheathingMap.get(sheathing);
  return uFactorData ? uFactorData.uFactor : null;
}

export function calculateWallHeatTransferMultiplier(
  cavityInsulation: string,
  sheathing: string,
  tempDifference: number,
): number | null {
  const uFactor = getUFactorForWall(cavityInsulation, sheathing);
  if (uFactor === null) return null;
  return uFactor * tempDifference;
}
