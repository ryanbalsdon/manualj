import {
  getCavityInsulationTypes,
  getSheathingTypesForCavityInsulation,
  calculateWallHeatTransferMultiplier,
  getWallData,
} from "./walls";

describe("Wall Heat Transfer Utilities", () => {
  test("getCavityInsulationTypes returns all cavity insulation types", () => {
    const cavityInsulationTypes = getCavityInsulationTypes();
    expect(cavityInsulationTypes).toEqual([
      "None",
      "R-11",
      "R-13",
      "R-19",
      "R-27",
      "R-30",
      "R-33",
    ]);
  });

  test("getSheathingTypesForCavityInsulation returns sheathing types for 'None' cavity insulation", () => {
    const sheathingTypes = getSheathingTypesForCavityInsulation("None");
    expect(sheathingTypes).toEqual([
      '½" Gypsum Brd (R-0.5)',
      '½" Asphalt Brd (R-1.3)',
    ]);
  });

  test("getSheathingTypesForCavityInsulation returns empty array for invalid cavity insulation type", () => {
    const sheathingTypes = getSheathingTypesForCavityInsulation(
      "InvalidInsulationType",
    );
    expect(sheathingTypes).toEqual([]);
  });

  test("getUFactorForWall returns correct U-factor for known combination", () => {
    const wallData = getWallData("None", '½" Gypsum Brd (R-0.5)');
    expect(wallData?.uFactor).toBe(0.271);
  });

  test("getUFactorForWall returns null for invalid cavity insulation type", () => {
    const wallData = getWallData("InvalidInsulation", '½" Gypsum Brd (R-0.5)');
    expect(wallData).toBeNull();
  });

  test("getUFactorForWall returns null for invalid sheathing type", () => {
    const wallData = getWallData("None", "InvalidSheathing");
    expect(wallData).toBeNull();
  });

  test("calculateWallHeatTransferMultiplier calculates correctly", () => {
    const multiplier = calculateWallHeatTransferMultiplier(
      "None",
      '½" Gypsum Brd (R-0.5)',
      10,
    );
    expect(multiplier).toBe(2.71); // 0.271 * 10
  });

  test("calculateWallHeatTransferMultiplier returns null for invalid cavity insulation type", () => {
    const multiplier = calculateWallHeatTransferMultiplier(
      "InvalidInsulation",
      '½" Gypsum Brd (R-0.5)',
      10,
    );
    expect(multiplier).toBeNull();
  });

  test("calculateWallHeatTransferMultiplier returns null for invalid sheathing type", () => {
    const multiplier = calculateWallHeatTransferMultiplier(
      "None",
      "InvalidSheathing",
      10,
    );
    expect(multiplier).toBeNull();
  });
});
