import {
  interpolateHeatTransferMultiplier,
  createMemoizedMapBuilder,
  createHeatTransferRepository,
} from "@/utils/repository";
import { floorHeatTransferMultipliers as floorData } from "@/data/heatTransferMultipliers/floors";

// Define the specific data structure for a floor entry
type FloorEntryData = {
  uFactor: number;
  htmByTemperature: { [key: number]: number };
};

// Define key extractors for the floor data structure
const floorKeyExtractors: [
  (entry: (typeof floorData)[0]) => string,
  (entry: (typeof floorData)[0]) => string,
  (entry: (typeof floorData)[0]) => string,
  (entry: (typeof floorData)[0]) => FloorEntryData,
] = [
  (entry) => entry.floorType,
  (entry) => entry.constructionType,
  (entry) => entry.insulationRValue,
  (entry) => ({
    uFactor: entry.uFactor,
    htmByTemperature: entry.htmByTemperature,
  }),
];

// Create the memoized map builder for floors
const buildFloorMap = createMemoizedMapBuilder<
  (typeof floorData)[0],
  [string, string, string], // Keys: floorType, constructionType, insulationRValue
  FloorEntryData
>(floorData, floorKeyExtractors);

// Create the floor data repository
const floorRepository = createHeatTransferRepository<
  [string, string, string],
  FloorEntryData
>(buildFloorMap, ["floorType", "constructionType", "insulationRValue"]);

export function getFloorTypes(): string[] {
  return floorRepository.getAvailableOptions();
}

export function getConstructionTypesForFloorType(floorType: string): string[] {
  return floorRepository.getAvailableOptions(floorType);
}

export function getInsulationTypesForConstruction(
  floorType: string,
  constructionType: string,
): string[] {
  return floorRepository.getAvailableOptions(floorType, constructionType);
}

export function getFloorData(
  floorType: string,
  constructionType: string,
  insulationRValue: string,
): FloorEntryData | null {
  return floorRepository.getData(floorType, constructionType, insulationRValue);
}

export function calculateHeatTransferMultiplier(
  floorType: string,
  constructionType: string,
  insulationRValue: string,
  tempDifference: number,
): number | null {
  const data = floorRepository.getData(
    floorType,
    constructionType,
    insulationRValue,
  );
  if (!data) return null;

  return interpolateHeatTransferMultiplier(
    data.htmByTemperature,
    tempDifference,
    data.uFactor,
  );
}
