import { ceilingHeatTransferMultipliers as ceilingData } from "@/data/heatTransferMultipliers/ceilings";

const buildCeilingComponentMap = (() => {
  let cacheBuilt = false;
  const ceilingCache = new Map<string, Map<string, { uFactor: number }>>();

  return () => {
    if (cacheBuilt) return ceilingCache;

    for (const entry of ceilingData) {
      let constructionMap = ceilingCache.get(entry.ceilingType);
      if (!constructionMap) {
        constructionMap = new Map();
        ceilingCache.set(entry.ceilingType, constructionMap);
      }

      constructionMap.set(entry.construction, {
        uFactor: entry.uFactor,
      });
    }

    cacheBuilt = true;
    return ceilingCache;
  };
})();

export function getCeilingTypes(): string[] {
  const ceilingMap = buildCeilingComponentMap();
  return Array.from(ceilingMap.keys());
}

export function getConstructionsForCeilingType(ceilingType: string): string[] {
  const ceilingMap = buildCeilingComponentMap();
  const constructionMap = ceilingMap.get(ceilingType);
  return constructionMap ? Array.from(constructionMap.keys()) : [];
}

export function getUFactor(
  ceilingType: string,
  construction: string,
): number | null {
  const ceilingMap = buildCeilingComponentMap();
  const constructionMap = ceilingMap.get(ceilingType);
  if (!constructionMap) return null;

  const uFactorData = constructionMap.get(construction);
  return uFactorData ? uFactorData.uFactor : null;
}

export function calculateHeatTransferMultiplier(
  ceilingType: string,
  construction: string,
  tempDifference: number,
): number | null {
  const uFactor = getUFactor(ceilingType, construction);
  if (uFactor === null) return null;
  return uFactor * tempDifference;
}
