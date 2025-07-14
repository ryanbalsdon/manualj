import { interpolateHeatTransferMultiplier } from "./interpolationUtils";

import { windowHeatTransferMultipliers as windowData } from "@/data/heatTransferMultipliers/windows";

const buildWindowComponentMap = (() => {
  let cacheBuilt = false;
  const windowCache = new Map<
    string,
    Map<
      string,
      Map<
        string,
        { uFactor: number; htmByTemperature: { [key: number]: number } }
      >
    >
  >();

  return () => {
    if (cacheBuilt) return windowCache;

    for (const entry of windowData) {
      let glassMap = windowCache.get(entry.windowType);
      if (!glassMap) {
        glassMap = new Map();
        windowCache.set(entry.windowType, glassMap);
      }

      let frameMap = glassMap.get(entry.glassType);
      if (!frameMap) {
        frameMap = new Map();
        glassMap.set(entry.glassType, frameMap);
      }

      frameMap.set(entry.frameType, {
        uFactor: entry.uFactor,
        htmByTemperature: entry.htmByTemperature,
      });
    }

    cacheBuilt = true;
    return windowCache;
  };
})();

export function getWindowTypes(): string[] {
  const windowMap = buildWindowComponentMap();
  return Array.from(windowMap.keys());
}

export function getGlassTypesForWindowType(windowType: string): string[] {
  const windowMap = buildWindowComponentMap();
  const glassMap = windowMap.get(windowType);
  return glassMap ? Array.from(glassMap.keys()) : [];
}

export function getFrameTypesForWindowAndGlass(
  windowType: string,
  glassType: string,
): string[] {
  const windowMap = buildWindowComponentMap();
  const glassMap = windowMap.get(windowType);
  if (!glassMap) return [];

  const frameMap = glassMap.get(glassType);
  return frameMap ? Array.from(frameMap.keys()) : [];
}

export function getWindowData(
  windowType: string,
  glassType: string,
  frameType: string,
): { uFactor: number; htmByTemperature: { [key: number]: number } } | null {
  const windowMap = buildWindowComponentMap();
  const glassMap = windowMap.get(windowType);
  if (!glassMap) return null;

  const frameMap = glassMap.get(glassType);
  if (!frameMap) return null;

  const windowData = frameMap.get(frameType);
  return windowData || null;
}

export function calculateWindowHeatTransferMultiplier(
  windowType: string,
  glassType: string,
  frameType: string,
  tempDifference: number,
): number | null {
  const windowData = getWindowData(windowType, glassType, frameType);
  if (windowData === null) return null;

  const { uFactor, htmByTemperature } = windowData;
  return interpolateHeatTransferMultiplier(
    htmByTemperature,
    tempDifference,
    uFactor,
  );
}
