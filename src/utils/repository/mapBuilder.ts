/**
 * Represents a function that extracts a key or a final value from a data entry.
 * @template T The type of the raw data entry.
 * @template K The type of the key or final value extracted.
 */
export type KeyExtractor<T, K> = (entry: T) => K;

/**
 * Represents the final data structure stored at the deepest level of the map.
 * This will typically be { uFactor: number; htmByTemperature: { [key: number]: number } }
 * or similar for masonry walls.
 */
export type FinalValue = Record<string, unknown>;

/**
 * The type of the nested map. This will be dynamic based on the number of key extractors.
 * @template K An array of types representing the keys at each level of the nested map.
 * @template V The type of the final value stored at the deepest level.
 * For 2 levels: Map<Key1, Map<Key2, FinalValue>>
 * For 3 levels: Map<Key1, Map<Key2, Map<Key3, FinalValue>>>
 */
export type NestedMap<K extends unknown[], V> = K extends [
  infer Head,
  ...infer Tail,
]
  ? Map<Head, NestedMap<Tail, V>>
  : V;

/**
 * Creates a memoized function that builds a nested Map from a flat array of data objects.
 * The map is built recursively based on the provided key extractors.
 *
 * @template T The type of the raw data entries in the input array.
 * @template K An array of types representing the keys at each level of the nested map.
 * @template V The type of the final value stored at the deepest level, which must extend FinalValue.
 * @param rawData An array of objects, where each object represents a data entry (e.g., `ceilingHeatTransferMultipliers`).
 * @param keyExtractors An array of functions. Each function in this array takes a data entry object and returns the key for a specific level of the nested map. The last function in the array should return the final value to be stored at the deepest level of the map.
 * @returns A memoized function (`() => NestedMap<K, V>`) that, when called, returns the fully built nested `Map`.
 */
export function createMemoizedMapBuilder<T, K extends unknown[], V>(
  rawData: T[],
  keyExtractors: [
    ...{ [I in keyof K]: KeyExtractor<T, K[I]> },
    KeyExtractor<T, V>,
  ],
): () => NestedMap<K, V> {
  // As per clarification, K cannot be an empty array, meaning there must be at least one key extractor for map levels.
  // This implies keyExtractors.length must be at least 2 (one key extractor + one final value extractor).
  if (keyExtractors.length < 2) {
    throw new Error(
      "createMemoizedMapBuilder requires at least one key extractor for map levels in addition to the final value extractor. K cannot be an empty array.",
    );
  }

  let cacheBuilt = false;
  let cachedMap: NestedMap<K, V>;

  return () => {
    if (cacheBuilt) {
      return cachedMap;
    }

    /**
     * Recursively builds the nested map.
     * @param data The subset of raw data relevant to the current level.
     * @param extractorIndex The current index in the keyExtractors array.
     * @param currentMap The Map instance being built at the current level.
     * @returns The current Map instance after processing its level.
     */
    const buildMapRecursive = (
      data: T[],
      extractorIndex: number,
      currentMap: Map<unknown, unknown>,
    ): Map<unknown, unknown> => {
      const currentKeyExtractor = keyExtractors[extractorIndex] as KeyExtractor<
        T,
        unknown
      >;

      // Group data by the current level's key
      const groupedData = new Map<unknown, T[]>();
      data.forEach((entry) => {
        const key = currentKeyExtractor(entry);
        const data = groupedData.get(key) ?? [];
        groupedData.set(key, [...data, entry]);
      });

      groupedData.forEach((entries, key) => {
        if (extractorIndex === keyExtractors.length - 2) {
          // If next extractor is the final value extractor,  set it directly.
          const finalValueExtractor = keyExtractors[
            extractorIndex + 1
          ] as KeyExtractor<T, V>;
          // We assume that for a given set of keys, there is only one entry.
          (currentMap as Map<unknown, V>).set(
            key,
            finalValueExtractor(entries[0]),
          );
        } else {
          // Otherwise, continue building the nested map structure.
          let nextMap = currentMap.get(key);
          if (!nextMap) {
            nextMap = new Map();
            currentMap.set(key, nextMap);
          }
          buildMapRecursive(
            entries,
            extractorIndex + 1,
            nextMap as Map<unknown, unknown>,
          );
        }
      });
      return currentMap;
    };

    cachedMap = buildMapRecursive(rawData, 0, new Map()) as NestedMap<K, V>;
    cacheBuilt = true;
    return cachedMap;
  };
}
