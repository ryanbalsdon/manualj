import {
  interpolateHeatTransferMultiplier,
  createMemoizedMapBuilder,
  createHeatTransferRepository,
} from "@/utils/repository";
import { windowHeatTransferMultipliers as windowData } from "@/data/heatTransferMultipliers/windows";

// Define the specific data structure for a window entry
type WindowEntryData = {
  uFactor: number;
  htmByTemperature: { [key: number]: number };
};

// Define key extractors for the window data structure
const windowKeyExtractors: [
  (entry: (typeof windowData)[0]) => string,
  (entry: (typeof windowData)[0]) => string,
  (entry: (typeof windowData)[0]) => string,
  (entry: (typeof windowData)[0]) => WindowEntryData,
] = [
  (entry) => entry.windowType,
  (entry) => entry.glassType,
  (entry) => entry.frameType,
  (entry) => ({
    uFactor: entry.uFactor,
    htmByTemperature: entry.htmByTemperature,
  }),
];

// Create the memoized map builder for windows
const buildWindowMap = createMemoizedMapBuilder<
  (typeof windowData)[0],
  [string, string, string], // Keys: windowType, glassType, frameType
  WindowEntryData
>(windowData, windowKeyExtractors);

// Create the window data repository
const windowRepository = createHeatTransferRepository<
  [string, string, string],
  WindowEntryData
>(buildWindowMap, ["windowType", "glassType", "frameType"]);

export function getWindowTypes(): string[] {
  return windowRepository.getAvailableOptions();
}

export function getGlassTypesForWindowType(windowType: string): string[] {
  return windowRepository.getAvailableOptions(windowType);
}

export function getFrameTypesForWindowAndGlass(
  windowType: string,
  glassType: string,
): string[] {
  return windowRepository.getAvailableOptions(windowType, glassType);
}

export function getWindowData(
  windowType: string,
  glassType: string,
  frameType: string,
): WindowEntryData | null {
  return windowRepository.getData(windowType, glassType, frameType);
}

export function calculateWindowHeatTransferMultiplier(
  windowType: string,
  glassType: string,
  frameType: string,
  tempDifference: number,
): number | null {
  const data = windowRepository.getData(windowType, glassType, frameType);
  if (!data) return null;

  return interpolateHeatTransferMultiplier(
    data.htmByTemperature,
    tempDifference,
    data.uFactor,
  );
}
