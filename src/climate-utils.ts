import { climateData } from './data/climate';

const buildStateMap = (() => {
  let cacheBuilt = false;
  const climateCache = new Map<
    string,
    Map<string, { winter_design_db: number | null }>
  >();

  return () => {
    if (cacheBuilt) return climateCache;

    for (const entry of climateData) {
      let stateMap = climateCache.get(entry.state);
      if (!stateMap) {
        stateMap = new Map();
        climateCache.set(entry.state, stateMap);
      }
      stateMap.set(entry.location, {
        winter_design_db: entry.winter_design_db,
      });
    }

    cacheBuilt = true;
    return climateCache;
  };
})();

export function getUniqueStates(): string[] {
  const stateMap = buildStateMap();
  return Array.from(stateMap.keys());
}

export function getLocationsForState(state: string): string[] {
  const stateMap = buildStateMap();
  const locationMap = stateMap.get(state);
  return locationMap ? Array.from(locationMap.keys()) : [];
}

export function getWinterDesignTemperature(
  state: string,
  location: string,
): number | null {
  const stateMap = buildStateMap();
  const locationMap = stateMap.get(state);
  if (!locationMap) return null;

  const locationData = locationMap.get(location);
  return locationData ? locationData.winter_design_db : null;
}
