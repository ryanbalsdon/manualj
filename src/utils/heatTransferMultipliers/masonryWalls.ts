import { masonryWallHeatTransferMultipliers as masonryWallData } from "@/data/heatTransferMultipliers/masonryWalls";

const buildMasonryWallComponentMap = (() => {
  let cacheBuilt = false;
  const masonryWallCache = new Map<
    string,
    Map<
      string,
      {
        uFactorAboveGrade: number;
        uFactorCrawlspace: number | null;
        uFactorBasement: number | null;
      }
    >
  >();

  return () => {
    if (cacheBuilt) return masonryWallCache;

    for (const entry of masonryWallData) {
      let insulationMap = masonryWallCache.get(entry.wallType);
      if (!insulationMap) {
        insulationMap = new Map();
        masonryWallCache.set(entry.wallType, insulationMap);
      }

      insulationMap.set(entry.insulation, {
        uFactorAboveGrade: entry.uFactorAboveGrade,
        uFactorCrawlspace: entry.uFactorCrawlspace,
        uFactorBasement: entry.uFactorBasement,
      });
    }

    cacheBuilt = true;
    return masonryWallCache;
  };
})();

export function getMasonryWallTypes(): string[] {
  const masonryWallMap = buildMasonryWallComponentMap();
  return Array.from(masonryWallMap.keys());
}

export function getInsulationTypesForMasonryWallType(
  wallType: string,
): string[] {
  const masonryWallMap = buildMasonryWallComponentMap();
  const insulationMap = masonryWallMap.get(wallType);
  return insulationMap ? Array.from(insulationMap.keys()) : [];
}

export function getUFactorsForMasonryWall(
  wallType: string,
  insulation: string,
): {
  uFactorAboveGrade: number;
  uFactorCrawlspace: number | null;
  uFactorBasement: number | null;
} | null {
  const masonryWallMap = buildMasonryWallComponentMap();
  const insulationMap = masonryWallMap.get(wallType);
  if (!insulationMap) return null;

  const uFactorData = insulationMap.get(insulation);
  return uFactorData || null;
}

export function calculateMasonryWallHeatTransferMultiplierPerLinearFoot(
  wallType: string,
  insulation: string,
  feetAboveGrade: number,
  feetBelowGrade: number,
  tempDifference: number,
): number | null {
  const uFactors = getUFactorsForMasonryWall(wallType, insulation);
  if (!uFactors) return null;

  let uFactorBelowGrade: number = 0;

  if (feetBelowGrade <= 2) {
    uFactorBelowGrade = uFactors.uFactorAboveGrade;
  } else if (feetBelowGrade > 2 && feetBelowGrade <= 5) {
    uFactorBelowGrade = uFactors.uFactorCrawlspace ?? 0;
  } else {
    // feetBelowGrade > 5
    uFactorBelowGrade = uFactors.uFactorBasement ?? 0;
  }

  const htmAboveGrade =
    uFactors.uFactorAboveGrade * feetAboveGrade * tempDifference;
  const htmBelowGrade = uFactorBelowGrade * feetBelowGrade * tempDifference;

  return htmAboveGrade + htmBelowGrade;
}
