import { floorHeatTransferMultipliers as floorData } from "@/data/heatTransferMultipliers/floors";

const buildFloorComponentMap = (() => {
  let cacheBuilt = false;
  const floorCache = new Map<string, Map<string, Map<string, { uFactor: number }>>>();

  return () => {
    if (cacheBuilt) return floorCache;

    for (const entry of floorData) {
      let constructionMap = floorCache.get(entry.floorType);
      if (!constructionMap) {
        constructionMap = new Map();
        floorCache.set(entry.floorType, constructionMap);
      }

      let insulationMap = constructionMap.get(entry.constructionType);
      if (!insulationMap) {
        insulationMap = new Map();
        constructionMap.set(entry.constructionType, insulationMap);
      }

      insulationMap.set(entry.insulationRValue, {
        uFactor: entry.uFactor,
      });
    }

    cacheBuilt = true;
    return floorCache;
  };
})();

export function getFloorTypes(): string[] {
  const floorMap = buildFloorComponentMap();
  return Array.from(floorMap.keys());
}

export function getConstructionTypesForFloorType(floorType: string): string[] {
  const floorMap = buildFloorComponentMap();
  const constructionMap = floorMap.get(floorType);
  return constructionMap ? Array.from(constructionMap.keys()) : [];
}

export function getInsulationTypesForConstruction(
  floorType: string,
  constructionType: string
): string[] {
  const floorMap = buildFloorComponentMap();
  const constructionMap = floorMap.get(floorType);
  if (!constructionMap) return [];
  
  const insulationMap = constructionMap.get(constructionType);
  return insulationMap ? Array.from(insulationMap.keys()) : [];
}

export function getUFactor(
  floorType: string,
  constructionType: string,
  insulationRValue: string
): number | null {
  const floorMap = buildFloorComponentMap();
  const constructionMap = floorMap.get(floorType);
  if (!constructionMap) return null;
  
  const insulationMap = constructionMap.get(constructionType);
  if (!insulationMap) return null;
  
  const uFactorData = insulationMap.get(insulationRValue);
  return uFactorData ? uFactorData.uFactor : null;
}

export function calculateHeatTransferMultiplier(
  floorType: string,
  constructionType: string,
  insulationRValue: string,
  tempDifference: number
): number | null {
  const uFactor = getUFactor(floorType, constructionType, insulationRValue);
  if (uFactor === null) return null;
  return uFactor * tempDifference;
}