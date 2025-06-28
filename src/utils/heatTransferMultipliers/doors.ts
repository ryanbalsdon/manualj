import { doorHeatTransferMultipliers as doorData } from "@/data/heatTransferMultipliers/doors";

const buildDoorComponentMap = (() => {
  let cacheBuilt = false;
  const doorCache = new Map<
    string,
    Map<string, Map<string, { uFactor: number }>>
  >();

  return () => {
    if (cacheBuilt) return doorCache;

    for (const entry of doorData) {
      let windowMap = doorCache.get(entry.windowType);
      if (!windowMap) {
        windowMap = new Map();
        doorCache.set(entry.windowType, windowMap);
      }

      let glassMap = windowMap.get(entry.glassType);
      if (!glassMap) {
        glassMap = new Map();
        windowMap.set(entry.glassType, glassMap);
      }

      glassMap.set(entry.frameType, {
        uFactor: entry.uFactor,
      });
    }

    cacheBuilt = true;
    return doorCache;
  };
})();

export function getWindowTypes(): string[] {
  const doorMap = buildDoorComponentMap();
  return Array.from(doorMap.keys());
}

export function getGlassTypesForWindowType(windowType: string): string[] {
  const doorMap = buildDoorComponentMap();
  const windowMap = doorMap.get(windowType);
  return windowMap ? Array.from(windowMap.keys()) : [];
}

export function getFrameTypesForWindowAndGlass(
  windowType: string,
  glassType: string,
): string[] {
  const doorMap = buildDoorComponentMap();
  const windowMap = doorMap.get(windowType);
  if (!windowMap) return [];

  const glassMap = windowMap.get(glassType);
  return glassMap ? Array.from(glassMap.keys()) : [];
}

export function getUFactor(
  windowType: string,
  glassType: string,
  frameType: string,
): number | null {
  const doorMap = buildDoorComponentMap();
  const windowMap = doorMap.get(windowType);
  if (!windowMap) return null;

  const glassMap = windowMap.get(glassType);
  if (!glassMap) return null;

  const frameData = glassMap.get(frameType);
  return frameData ? frameData.uFactor : null;
}

export function calculateHeatTransferMultiplier(
  windowType: string,
  glassType: string,
  frameType: string,
  tempDifference: number,
): number | null {
  const uFactor = getUFactor(windowType, glassType, frameType);
  if (uFactor === null) return null;
  return uFactor * tempDifference;
}
