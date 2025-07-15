import {
  interpolateHeatTransferMultiplier,
  createMemoizedMapBuilder,
  createHeatTransferRepository,
} from "@/utils/repository";
import { doorHeatTransferMultipliers as doorData } from "@/data/heatTransferMultipliers/doors";

// Define the specific data structure for a door entry
type DoorEntryData = {
  uFactor: number;
  htmByTemperature: { [key: number]: number };
};

// Define key extractors for the door data structure
const doorKeyExtractors: [
  (entry: (typeof doorData)[0]) => string,
  (entry: (typeof doorData)[0]) => string,
  (entry: (typeof doorData)[0]) => string,
  (entry: (typeof doorData)[0]) => DoorEntryData,
] = [
  (entry) => entry.doorType,
  (entry) => entry.glassType,
  (entry) => entry.frameType,
  (entry) => ({
    uFactor: entry.uFactor,
    htmByTemperature: entry.htmByTemperature,
  }),
];

// Create the memoized map builder for doors
const buildDoorMap = createMemoizedMapBuilder<
  (typeof doorData)[0],
  [string, string, string], // Keys: doorType, glassType, frameType
  DoorEntryData
>(doorData, doorKeyExtractors);

// Create the door data repository
const doorRepository = createHeatTransferRepository<
  [string, string, string],
  DoorEntryData
>(buildDoorMap, ["doorType", "glassType", "frameType"]);

export function getDoorTypes(): string[] {
  return doorRepository.getAvailableOptions();
}

export function getGlassTypesForDoorType(doorType: string): string[] {
  return doorRepository.getAvailableOptions(doorType);
}

export function getFrameTypesForWindowAndGlass(
  doorType: string,
  glassType: string,
): string[] {
  return doorRepository.getAvailableOptions(doorType, glassType);
}

export function getDoorData(
  doorType: string,
  glassType: string,
  frameType: string,
): DoorEntryData | null {
  return doorRepository.getData(doorType, glassType, frameType);
}

export function calculateHeatTransferMultiplier(
  doorType: string,
  glassType: string,
  frameType: string,
  tempDifference: number,
): number | null {
  const data = doorRepository.getData(doorType, glassType, frameType);
  if (!data) return null;

  return interpolateHeatTransferMultiplier(
    data.htmByTemperature,
    tempDifference,
    data.uFactor,
  );
}
