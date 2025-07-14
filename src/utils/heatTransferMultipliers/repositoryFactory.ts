import type { NestedMap, FinalValue } from "./mapBuilder";

/**
 * Represents the generic repository interface for heat transfer data.
 * @template TData The type of the final data stored in the repository (e.g., FinalValue or a more specific type).
 */
interface IHeatTransferRepository<TData> {
  /**
   * Retrieves the available options for a given level, determined by the provided keys.
   * If no keys are provided, it returns the top-level options.
   * @param keys A sequence of strings representing the path to the desired level.
   * @returns An array of strings representing the available options at that level.
   */
  getAvailableOptions(...keys: string[]): string[];
  /**
   * Retrieves the conceptual names of the keys used in the repository.
   * @returns An array of strings, where each string is a key name.
   */
  getKeyNames(): string[];
  /**
   * Retrieves the specific data entry for a given set of keys.
   * @param keys A spread of strings representing the full path of keys to the desired data.
   * @returns The data entry of type TData, or null if not found.
   */
  getData(...keys: string[]): TData | null;
}

/**
 * Creates a heat transfer data repository with a standardized interface for accessing data
 * from a memoized nested map.
 *
 * @template K An array of types representing the keys at each level of the nested map.
 * @template V The type of the final value stored at the deepest level, which must extend FinalValue.
 * @param mapBuilder The memoized function returned by `createMemoizedMapBuilder` that builds the nested map.
 * @param keyNames An array of strings representing the conceptual names of the keys at each level (e.g., `['doorType', 'glassType', 'frameType']`). This is primarily for internal clarity and documentation.
 * @returns An object (the "repository") with methods like `getAvailableOptions(key1, ...)`, `getData(key1, ..., lastKey)`.
 */
export function createHeatTransferRepository<K extends unknown[], V extends FinalValue>(
  mapBuilder: () => NestedMap<K, V>,
  keyNames: string[] // Can be used for more dynamic methods or just for documentation
): IHeatTransferRepository<V> {
  const map = mapBuilder();

  const getNestedValue = (keys: string[]): unknown | null => {
    let current: unknown = map;
    for (const key of keys) {
      if (current instanceof Map && current.has(key)) {
        current = current.get(key);
      } else {
        return null;
      }
    }
    return current;
  };

  return {
    getAvailableOptions: (...keys: string[]): string[] => {
      const currentLevel = getNestedValue(keys);
      if (currentLevel instanceof Map) {
        return Array.from(currentLevel.keys()) as string[];
      }
      return [];
    },

    getKeyNames: (): string[] => {
      return keyNames;
    },

    getData: (...keys: string[]): V | null => {
      const data = getNestedValue(keys);
      return (data && !(data instanceof Map)) ? data as V : null;
    },
  };
}