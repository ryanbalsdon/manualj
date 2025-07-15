import {
  interpolateHeatTransferMultiplier,
  createMemoizedMapBuilder,
  createHeatTransferRepository,
} from "@/utils/repository";
import { wallHeatTransferMultipliers as wallData } from "@/data/heatTransferMultipliers/walls";

// Define the specific data structure for a wall entry
type WallEntryData = {
  uFactor: number;
  htmByTemperature: { [key: number]: number };
};

// Define key extractors for the wall data structure
const wallKeyExtractors: [
  (entry: (typeof wallData)[0]) => string,
  (entry: (typeof wallData)[0]) => string,
  (entry: (typeof wallData)[0]) => WallEntryData,
] = [
  (entry) => entry.cavityInsulation,
  (entry) => entry.sheathing,
  (entry) => ({
    uFactor: entry.uFactor,
    htmByTemperature: entry.htmByTemperature,
  }),
];

// Create the memoized map builder for walls
const buildWallMap = createMemoizedMapBuilder<
  (typeof wallData)[0],
  [string, string], // Keys: cavityInsulation, sheathing
  WallEntryData
>(wallData, wallKeyExtractors);

// Create the wall data repository
const wallRepository = createHeatTransferRepository<
  [string, string],
  WallEntryData
>(buildWallMap, ["cavityInsulation", "sheathing"]);

export function getCavityInsulationTypes(): string[] {
  return wallRepository.getAvailableOptions();
}

export function getSheathingTypesForCavityInsulation(
  cavityInsulation: string,
): string[] {
  return wallRepository.getAvailableOptions(cavityInsulation);
}

export function getWallData(
  cavityInsulation: string,
  sheathing: string,
): WallEntryData | null {
  return wallRepository.getData(cavityInsulation, sheathing);
}

export function calculateWallHeatTransferMultiplier(
  cavityInsulation: string,
  sheathing: string,
  tempDifference: number,
): number | null {
  const data = wallRepository.getData(cavityInsulation, sheathing);
  if (!data) return null;

  return interpolateHeatTransferMultiplier(
    data.htmByTemperature,
    tempDifference,
    data.uFactor,
  );
}
