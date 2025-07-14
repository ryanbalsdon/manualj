import { createMemoizedMapBuilder, FinalValue, NestedMap, KeyExtractor } from './mapBuilder';

describe('createMemoizedMapBuilder', () => {
  interface MockEntry {
    type: string;
    subtype: string;
    id: number;
    uFactor: number;
    htmByTemperature: { [key: number]: number };
  }

  const mockRawData: MockEntry[] = [
    { type: 'A', subtype: 'X', id: 1, uFactor: 0.1, htmByTemperature: { 10: 1, 20: 2 } },
    { type: 'A', subtype: 'Y', id: 2, uFactor: 0.2, htmByTemperature: { 10: 3, 20: 4 } },
    { type: 'B', subtype: 'X', id: 3, uFactor: 0.3, htmByTemperature: { 10: 5, 20: 6 } },
  ];

  const keyExtractors: [
    KeyExtractor<MockEntry, string>,
    KeyExtractor<MockEntry, string>,
    KeyExtractor<MockEntry, FinalValue>
  ] = [
    (entry: MockEntry) => entry.type,
    (entry: MockEntry) => entry.subtype,
    (entry: MockEntry): FinalValue => ({
      uFactor: entry.uFactor,
      htmByTemperature: entry.htmByTemperature,
    }),
  ];

  it('should build a memoized nested map correctly', () => {
    const buildMap = createMemoizedMapBuilder(mockRawData, keyExtractors);
    const map = buildMap();

    expect(map).toBeInstanceOf(Map);
    expect(map.size).toBe(2); // 'A', 'B'

    const mapA = map.get('A') as Map<string, FinalValue>;
    expect(mapA).toBeInstanceOf(Map);
    expect(mapA.size).toBe(2); // 'X', 'Y'

    const mapB = map.get('B') as Map<string, FinalValue>;
    expect(mapB).toBeInstanceOf(Map);
    expect(mapB.size).toBe(1); // 'X'

    const valueAX = mapA.get('X');
    expect(valueAX).toEqual({ uFactor: 0.1, htmByTemperature: { 10: 1, 20: 2 } });

    const valueAY = mapA.get('Y');
    expect(valueAY).toEqual({ uFactor: 0.2, htmByTemperature: { 10: 3, 20: 4 } });

    const valueBX = mapB.get('X');
    expect(valueBX).toEqual({ uFactor: 0.3, htmByTemperature: { 10: 5, 20: 6 } });
  });

  it('should return the cached map on subsequent calls', () => {
    const buildMap = createMemoizedMapBuilder(mockRawData, keyExtractors);
    const map1 = buildMap();
    const map2 = buildMap();

    expect(map1).toBe(map2); // Should be the same instance
  });

  it('should handle empty raw data', () => {
    const buildMap = createMemoizedMapBuilder([], keyExtractors);
    const map = buildMap();
    expect(map).toBeInstanceOf(Map);
    expect(map.size).toBe(0);
  });

  it('should handle one key level + final value mapping', () => {
    interface OneLevelEntry {
      name: string;
      uFactor: number;
      htmByTemperature: { [key: number]: number };
    }

    const oneLevelData: OneLevelEntry[] = [
      { name: 'Item1', uFactor: 1.0, htmByTemperature: { 1: 10 } },
      { name: 'Item2', uFactor: 2.0, htmByTemperature: { 2: 20 } },
    ];

    const oneLevelKeyExtractors: [
      KeyExtractor<OneLevelEntry, string>,
      KeyExtractor<OneLevelEntry, FinalValue>,
    ] = [
      (entry: OneLevelEntry) => entry.name, // First key extractor
      (entry: OneLevelEntry): FinalValue => ({
        // Final value extractor
        uFactor: entry.uFactor,
        htmByTemperature: entry.htmByTemperature,
      }),
    ];

    const buildOneLevelMap = createMemoizedMapBuilder(oneLevelData, oneLevelKeyExtractors);
    const oneLevelMap = buildOneLevelMap();

    expect(oneLevelMap).toBeInstanceOf(Map);
    expect(oneLevelMap.size).toBe(2);
    expect(oneLevelMap.get('Item1')).toEqual({ uFactor: 1.0, htmByTemperature: { 1: 10 } });
    expect(oneLevelMap.get('Item2')).toEqual({ uFactor: 2.0, htmByTemperature: { 2: 20 } });
  });
  it('should throw an error if K is an empty array (keyExtractors.length < 2)', () => {
    interface SimpleEntry {
      uFactor: number;
      htmByTemperature: { [key: number]: number };
    }

    const simpleData: SimpleEntry[] = [
      { uFactor: 1.0, htmByTemperature: { 1: 10 } },
    ];

    const simpleKeyExtractors: [KeyExtractor<SimpleEntry, FinalValue>] = [
      (entry: SimpleEntry): FinalValue => ({
        uFactor: entry.uFactor,
        htmByTemperature: entry.htmByTemperature,
      }),
    ];

    // Expecting an error because K is implicitly empty here (only one extractor for FinalValue)
    expect(() => createMemoizedMapBuilder(simpleData, simpleKeyExtractors)).toThrow(
      "createMemoizedMapBuilder requires at least one key extractor for map levels in addition to the final value extractor. K cannot be an empty array."
    );
  });
});