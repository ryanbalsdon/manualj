import {
  getFloorTypes,
  getConstructionTypesForFloorType,
  getInsulationTypesForConstruction,
  getUFactor,
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
      "Concrete Slab with Perimeter Warm Air Duct System"
    ]);
  });

  test("getConstructionTypesForFloorType returns construction types for 'Unheated Basement'", () => {
    const constructionTypes = getConstructionTypesForFloorType(
      "Unheated Basement or Crawl Space"
    );
    expect(constructionTypes).toEqual([
      "Hardwood Floor",
      "Carpeted Floor"
    ]);
  });

  test("getConstructionTypesForFloorType returns empty array for invalid floor type", () => {
    const constructionTypes = getConstructionTypesForFloorType("InvalidFloorType");
    expect(constructionTypes).toEqual([]);
  });

  test("getInsulationTypesForConstruction returns insulation types for 'Hardwood Floor' in 'Unheated Basement'", () => {
    const insulationTypes = getInsulationTypesForConstruction(
      "Unheated Basement or Crawl Space",
      "Hardwood Floor"
    );
    expect(insulationTypes).toEqual([
      "No Insulation",
      "R-11",
      "R-13",
      "R-19",
      "R-30"
    ]);
  });

  test("getInsulationTypesForConstruction returns empty array for invalid floor type", () => {
    const insulationTypes = getInsulationTypesForConstruction(
      "InvalidFloorType",
      "Hardwood Floor"
    );
    expect(insulationTypes).toEqual([]);
  });

  test("getInsulationTypesForConstruction returns empty array for invalid construction type", () => {
    const insulationTypes = getInsulationTypesForConstruction(
      "Unheated Basement or Crawl Space",
      "InvalidConstruction"
    );
    expect(insulationTypes).toEqual([]);
  });

  test("getUFactor returns correct U-factor for known combination", () => {
    const uFactor = getUFactor(
      "Unheated Basement or Crawl Space",
      "Hardwood Floor",
      "No Insulation"
    );
    expect(uFactor).toBe(0.312);
  });

  test("getUFactor returns null for invalid floor type", () => {
    const uFactor = getUFactor(
      "InvalidFloorType",
      "Hardwood Floor",
      "No Insulation"
    );
    expect(uFactor).toBeNull();
  });

  test("getUFactor returns null for invalid construction type", () => {
    const uFactor = getUFactor(
      "Unheated Basement or Crawl Space",
      "InvalidConstruction",
      "No Insulation"
    );
    expect(uFactor).toBeNull();
  });

  test("getUFactor returns null for invalid insulation type", () => {
    const uFactor = getUFactor(
      "Unheated Basement or Crawl Space",
      "Hardwood Floor",
      "InvalidInsulation"
    );
    expect(uFactor).toBeNull();
  });

  test("calculateHeatTransferMultiplier calculates correctly", () => {
    const multiplier = calculateHeatTransferMultiplier(
      "Unheated Basement or Crawl Space",
      "Hardwood Floor",
      "No Insulation",
      15
    );
    expect(multiplier).toBe(4.68); // 0.312 * 15
  });

  test("calculateHeatTransferMultiplier returns null for invalid floor type", () => {
    const multiplier = calculateHeatTransferMultiplier(
      "InvalidFloorType",
      "Hardwood Floor",
      "No Insulation",
      15
    );
    expect(multiplier).toBeNull();
  });

  test("calculateHeatTransferMultiplier returns null for invalid construction type", () => {
    const multiplier = calculateHeatTransferMultiplier(
      "Unheated Basement or Crawl Space",
      "InvalidConstruction",
      "No Insulation",
      15
    );
    expect(multiplier).toBeNull();
  });

  test("calculateHeatTransferMultiplier returns null for invalid insulation type", () => {
    const multiplier = calculateHeatTransferMultiplier(
      "Unheated Basement or Crawl Space",
      "Hardwood Floor",
      "InvalidInsulation",
      15
    );
    expect(multiplier).toBeNull();
  });
});