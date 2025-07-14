import { interpolateHeatTransferMultiplier } from "./interpolationUtils";

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
        htmByTemperatureAboveGrade: { [key: number]: number };
        htmByTemperatureCrawlspace: { [key: number]: number } | null;
        htmByTemperatureBasement: { [key: number]: number } | null;
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
        htmByTemperatureAboveGrade: entry.htmByTemperatureAboveGrade,
        htmByTemperatureCrawlspace: entry.htmByTemperatureCrawlspace,
        htmByTemperatureBasement: entry.htmByTemperatureBasement,
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

export function getMasonryWallData(
  wallType: string,
  insulation: string,
): {
  uFactorAboveGrade: number;
  uFactorCrawlspace: number | null;
  uFactorBasement: number | null;
  htmByTemperatureAboveGrade: { [key: number]: number };
  htmByTemperatureCrawlspace: { [key: number]: number } | null;
  htmByTemperatureBasement: { [key: number]: number } | null;
} | null {
  const masonryWallMap = buildMasonryWallComponentMap();
  const insulationMap = masonryWallMap.get(wallType);
  if (!insulationMap) return null;

  const masonryWallData = insulationMap.get(insulation);
  return masonryWallData || null;
}

export function calculateMasonryWallHeatTransferMultiplierPerLinearFoot(
  wallType: string,
  insulation: string,
  feetAboveGrade: number,
  feetBelowGrade: number,
  tempDifference: number,
): number | null {
  const masonryWallData = getMasonryWallData(wallType, insulation);
  if (!masonryWallData) return null;

  let htmBelowGradeValue: number | null = null;

  if (feetBelowGrade <= 2) {
    htmBelowGradeValue = interpolateHeatTransferMultiplier(
      masonryWallData.htmByTemperatureAboveGrade,
      tempDifference,
      masonryWallData.uFactorAboveGrade,
    );
  } else if (feetBelowGrade > 2 && feetBelowGrade <= 5) {
    if (
      masonryWallData.htmByTemperatureCrawlspace &&
      masonryWallData.uFactorCrawlspace !== null
    ) {
      htmBelowGradeValue = interpolateHeatTransferMultiplier(
        masonryWallData.htmByTemperatureCrawlspace,
        tempDifference,
        masonryWallData.uFactorCrawlspace,
      );
    } else {
      htmBelowGradeValue =
        (masonryWallData.uFactorCrawlspace ?? 0) * tempDifference;
    }
  } else {
    // feetBelowGrade > 5
    if (
      masonryWallData.htmByTemperatureBasement &&
      masonryWallData.uFactorBasement !== null
    ) {
      htmBelowGradeValue = interpolateHeatTransferMultiplier(
        masonryWallData.htmByTemperatureBasement,
        tempDifference,
        masonryWallData.uFactorBasement,
      );
    } else {
      htmBelowGradeValue =
        (masonryWallData.uFactorBasement ?? 0) * tempDifference;
    }
  }

  const htmAboveGrade = interpolateHeatTransferMultiplier(
    masonryWallData.htmByTemperatureAboveGrade,
    tempDifference,
    masonryWallData.uFactorAboveGrade,
  );

  return htmAboveGrade * feetAboveGrade + htmBelowGradeValue * feetBelowGrade;
}
