import {
  interpolateHeatTransferMultiplier,
  createMemoizedMapBuilder,
  createHeatTransferRepository,
} from "@/utils/repository";
import { ceilingHeatTransferMultipliers as ceilingData } from "@/data/heatTransferMultipliers/ceilings";

// Define the specific data structure for a ceiling entry
type CeilingEntryData = {
  uFactor: number;
  htmByTemperature: { [key: number]: number };
};

// Define key extractors for the ceiling data structure
const ceilingKeyExtractors: [
  (entry: (typeof ceilingData)[0]) => string,
  (entry: (typeof ceilingData)[0]) => string,
  (entry: (typeof ceilingData)[0]) => CeilingEntryData,
] = [
  (entry: (typeof ceilingData)[0]) => entry.ceilingType,
  (entry: (typeof ceilingData)[0]) => entry.construction,
  (entry: (typeof ceilingData)[0]) =>
    ({
      uFactor: entry.uFactor,
      htmByTemperature: entry.htmByTemperature,
    }) satisfies CeilingEntryData,
];

// Create the memoized map builder for ceilings
const buildCeilingMap = createMemoizedMapBuilder<
  (typeof ceilingData)[0],
  [string, string], // Keys: ceilingType, construction
  CeilingEntryData
>(ceilingData, ceilingKeyExtractors);

// Create the ceiling data repository
const ceilingRepository = createHeatTransferRepository<
  [string, string],
  CeilingEntryData
>(buildCeilingMap, ["ceilingType", "construction"]);

export function getCeilingTypes(): string[] {
  return ceilingRepository.getAvailableOptions();
}

export function getConstructionsForCeilingType(ceilingType: string): string[] {
  return ceilingRepository.getAvailableOptions(ceilingType);
}

export function getCeilingData(
  ceilingType: string,
  construction: string,
): CeilingEntryData | null {
  return ceilingRepository.getData(ceilingType, construction);
}

export function calculateHeatTransferMultiplier(
  ceilingType: string,
  construction: string,
  tempDifference: number,
): number | null {
  const data = ceilingRepository.getData(ceilingType, construction);
  if (!data) return null;

  return interpolateHeatTransferMultiplier(
    data.htmByTemperature,
    tempDifference,
    data.uFactor,
  );
}
