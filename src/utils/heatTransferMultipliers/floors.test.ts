import {
  getFloorTypes,
  getConstructionTypesForFloorType,
  getInsulationTypesForConstruction,
  getFloorData,
  calculateHeatTransferMultiplier,
} from "./floors";

describe("Floor Heat Transfer Utilities", () => {
  test("getFloorTypes returns all floor types", () => {
    const floorTypes = getFloorTypes();
    expect(floorTypes).toEqual([
      "Unheated Basement or Crawl Space",
      "Open Crawl Space or Garage",
      "Basement Floors",
      "Concrete Slab on Grade",
      "Concrete Slab with Perimeter Warm Air Duct System",
    ]);
  });

  test("getConstructionTypesForFloorType returns construction types for 'Unheated Basement'", () => {
    const constructionTypes = getConstructionTypesForFloorType(
      "Unheated Basement or Crawl Space",
    );
    expect(constructionTypes).toEqual(["Hardwood Floor", "Carpeted Floor"]);
  });

  test("getConstructionTypesForFloorType returns empty array for invalid floor type", () => {
    const constructionTypes =
      getConstructionTypesForFloorType("InvalidFloorType");
    expect(constructionTypes).toEqual([]);
  });

  test("getInsulationTypesForConstruction returns insulation types for 'Hardwood Floor' in 'Unheated Basement'", () => {
    const insulationTypes = getInsulationTypesForConstruction(
      "Unheated Basement or Crawl Space",
      "Hardwood Floor",
    );
    expect(insulationTypes).toEqual([
      "No Insulation",
      "R-11",
      "R-13",
      "R-19",
      "R-30",
    ]);
  });

  test("getInsulationTypesForConstruction returns empty array for invalid floor type", () => {
    const insulationTypes = getInsulationTypesForConstruction(
      "InvalidFloorType",
      "Hardwood Floor",
    );
    expect(insulationTypes).toEqual([]);
  });

  test("getInsulationTypesForConstruction returns empty array for invalid construction type", () => {
    const insulationTypes = getInsulationTypesForConstruction(
      "Unheated Basement or Crawl Space",
      "InvalidConstruction",
    );
    expect(insulationTypes).toEqual([]);
  });

  test("getFloorData returns correct U-factor and htmByTemperature for known combination", () => {
    const floorData = getFloorData(
      "Unheated Basement or Crawl Space",
      "Hardwood Floor",
      "No Insulation",
    );
    expect(floorData?.uFactor).toBe(0.312);
    expect(floorData?.htmByTemperature).toBeDefined();
    expect(floorData?.htmByTemperature[20]).toBe(3.1);
  });

  test("getFloorData returns null for invalid floor type", () => {
    const floorData = getFloorData(
      "InvalidFloorType",
      "Hardwood Floor",
      "No Insulation",
    );
    expect(floorData).toBeNull();
  });

  test("getFloorData returns null for invalid construction type", () => {
    const floorData = getFloorData(
      "Unheated Basement or Crawl Space",
      "InvalidConstruction",
      "No Insulation",
    );
    expect(floorData).toBeNull();
  });

  test("getFloorData returns null for invalid insulation type", () => {
    const floorData = getFloorData(
      "Unheated Basement or Crawl Space",
      "Hardwood Floor",
      "InvalidInsulation",
    );
    expect(floorData).toBeNull();
  });

  test("calculateHeatTransferMultiplier interpolates correctly within range", () => {
    const multiplier = calculateHeatTransferMultiplier(
      "Unheated Basement or Crawl Space",
      "Hardwood Floor",
      "No Insulation",
      22.5, // Between 20 (3.1) and 25 (3.9)
    );
    expect(multiplier).toBeCloseTo(3.5);
  });

  test("calculateHeatTransferMultiplier falls back to uFactor for out-of-range tempDifference (below min)", () => {
    const multiplier = calculateHeatTransferMultiplier(
      "Unheated Basement or Crawl Space",
      "Hardwood Floor",
      "No Insulation",
      10, // Below minTemp of 20
    );
    expect(multiplier).toBeCloseTo(3.12);
  });

  test("calculateHeatTransferMultiplier falls back to uFactor for out-of-range tempDifference (above max)", () => {
    const multiplier = calculateHeatTransferMultiplier(
      "Unheated Basement or Crawl Space",
      "Hardwood Floor",
      "No Insulation",
      100, // Above maxTemp of 95
    );
    expect(multiplier).toBeCloseTo(31.2);
  });

  test("calculateHeatTransferMultiplier returns null for invalid floor type", () => {
    const multiplier = calculateHeatTransferMultiplier(
      "InvalidFloorType",
      "Hardwood Floor",
      "No Insulation",
      15,
    );
    expect(multiplier).toBeNull();
  });

  test("calculateHeatTransferMultiplier returns null for invalid construction type", () => {
    const multiplier = calculateHeatTransferMultiplier(
      "Unheated Basement or Crawl Space",
      "InvalidConstruction",
      "No Insulation",
      15,
    );
    expect(multiplier).toBeNull();
  });

  test("calculateHeatTransferMultiplier returns null for invalid insulation type", () => {
    const multiplier = calculateHeatTransferMultiplier(
      "Unheated Basement or Crawl Space",
      "Hardwood Floor",
      "InvalidInsulation",
      15,
    );
    expect(multiplier).toBeNull();
  });
});
