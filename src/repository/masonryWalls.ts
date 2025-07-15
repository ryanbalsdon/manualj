import {
  interpolateHeatTransferMultiplier,
  createMemoizedMapBuilder,
  createHeatTransferRepository,
} from "@/utils/repository";
import { masonryWallHeatTransferMultipliers as masonryWallData } from "@/data/heatTransferMultipliers/masonryWalls";

// Define the specific data structure for a masonry wall entry
type MasonryWallEntryData = {
  uFactorAboveGrade: number;
  uFactorCrawlspace: number | null;
  uFactorBasement: number | null;
  htmByTemperatureAboveGrade: { [key: number]: number };
  htmByTemperatureCrawlspace: { [key: number]: number } | null;
  htmByTemperatureBasement: { [key: number]: number } | null;
};

// Define key extractors for the masonry wall data structure
const masonryWallKeyExtractors: [
  (entry: (typeof masonryWallData)[0]) => string,
  (entry: (typeof masonryWallData)[0]) => string,
  (entry: (typeof masonryWallData)[0]) => MasonryWallEntryData,
] = [
  (entry) => entry.wallType,
  (entry) => entry.insulation,
  (entry) => ({
    uFactorAboveGrade: entry.uFactorAboveGrade,
    uFactorCrawlspace: entry.uFactorCrawlspace,
    uFactorBasement: entry.uFactorBasement,
    htmByTemperatureAboveGrade: entry.htmByTemperatureAboveGrade,
    htmByTemperatureCrawlspace: entry.htmByTemperatureCrawlspace,
    htmByTemperatureBasement: entry.htmByTemperatureBasement,
  }),
];

// Create the memoized map builder for masonry walls
const buildMasonryWallMap = createMemoizedMapBuilder<
  (typeof masonryWallData)[0],
  [string, string], // Keys: wallType, insulation
  MasonryWallEntryData
>(masonryWallData, masonryWallKeyExtractors);

// Create the masonry wall data repository
const masonryWallRepository = createHeatTransferRepository<
  [string, string],
  MasonryWallEntryData
>(buildMasonryWallMap, ["wallType", "insulation"]);

export function getMasonryWallTypes(): string[] {
  return masonryWallRepository.getAvailableOptions();
}

export function getInsulationTypesForMasonryWallType(
  wallType: string,
): string[] {
  return masonryWallRepository.getAvailableOptions(wallType);
}

export function getMasonryWallData(
  wallType: string,
  insulation: string,
): MasonryWallEntryData | null {
  return masonryWallRepository.getData(wallType, insulation);
}

export function calculateMasonryWallHeatTransferMultiplierPerLinearFoot(
  wallType: string,
  insulation: string,
  feetAboveGrade: number,
  feetBelowGrade: number,
  tempDifference: number,
): number | null {
  const data = masonryWallRepository.getData(wallType, insulation);
  if (!data) return null;

  let htmBelowGradeValue: number | null = null;

  if (feetBelowGrade <= 2) {
    htmBelowGradeValue = interpolateHeatTransferMultiplier(
      data.htmByTemperatureAboveGrade,
      tempDifference,
      data.uFactorAboveGrade,
    );
  } else if (feetBelowGrade > 2 && feetBelowGrade <= 5) {
    if (data.htmByTemperatureCrawlspace && data.uFactorCrawlspace) {
      htmBelowGradeValue = interpolateHeatTransferMultiplier(
        data.htmByTemperatureCrawlspace,
        tempDifference,
        data.uFactorCrawlspace,
      );
    } else {
      htmBelowGradeValue = (data.uFactorCrawlspace ?? 0) * tempDifference;
    }
  } else {
    // feetBelowGrade > 5
    if (data.htmByTemperatureBasement && data.uFactorBasement) {
      htmBelowGradeValue = interpolateHeatTransferMultiplier(
        data.htmByTemperatureBasement,
        tempDifference,
        data.uFactorBasement,
      );
    } else {
      htmBelowGradeValue = (data.uFactorBasement ?? 0) * tempDifference;
    }
  }

  const htmAboveGrade = interpolateHeatTransferMultiplier(
    data.htmByTemperatureAboveGrade,
    tempDifference,
    data.uFactorAboveGrade,
  );

  return htmAboveGrade * feetAboveGrade + htmBelowGradeValue * feetBelowGrade;
}
