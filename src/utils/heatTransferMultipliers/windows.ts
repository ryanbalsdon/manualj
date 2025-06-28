import { windowHeatTransferMultipliers as windowData } from "@/data/heatTransferMultipliers/windows";

const buildWindowComponentMap = (() => {
  let cacheBuilt = false;
  const windowCache = new Map<
    string,
    Map<string, Map<string, { uFactor: number }>>
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

export function getUFactorForWindow(
  windowType: string,
  glassType: string,
  frameType: string,
): number | null {
  const windowMap = buildWindowComponentMap();
  const glassMap = windowMap.get(windowType);
  if (!glassMap) return null;

  const frameMap = glassMap.get(glassType);
  if (!frameMap) return null;

  const frameData = frameMap.get(frameType);
  return frameData ? frameData.uFactor : null;
}

export function calculateWindowHeatTransferMultiplier(
  windowType: string,
  glassType: string,
  frameType: string,
  tempDifference: number,
): number | null {
  const uFactor = getUFactorForWindow(windowType, glassType, frameType);
  if (uFactor === null) return null;
  return uFactor * tempDifference;
}
