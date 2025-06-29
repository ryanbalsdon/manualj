import {
  getCeilingTypes,
  getConstructionsForCeilingType,
  getUFactor,
  calculateHeatTransferMultiplier,
} from "./ceilings";

describe("Ceiling Heat Transfer Utilities", () => {
  test("getCeilingTypes returns all ceiling types", () => {
    const ceilingTypes = getCeilingTypes();
    expect(ceilingTypes).toEqual([
      "Ventilated Attic",
      "Exposed Beams",
      "Roof-Ceiling Combination",
    ]);
  });

  test("getConstructionsForCeilingType returns constructions for 'Ventilated Attic'", () => {
    const constructions = getConstructionsForCeilingType("Ventilated Attic");
    expect(constructions).toEqual([
      "No Insulation",
      "R-7 Insulation",
      "R-11 Insulation",
      "R-19 Insulation",
      "R-22 Insulation",
      "R-26 Insulation",
      "R-30 Insulation",
      "R-38 Insulation",
      "R-44 Insulation",
      "R-57 Insulation",
      "Wood Decking, No Insulation",
    ]);
  });

  test("getConstructionsForCeilingType returns empty array for invalid ceiling type", () => {
    const constructions = getConstructionsForCeilingType("InvalidCeilingType");
    expect(constructions).toEqual([]);
  });

  test("getUFactor returns correct U-factor for known combination", () => {
    const uFactor = getUFactor("Ventilated Attic", "No Insulation");
    expect(uFactor).toBe(0.599);
  });

  test("getUFactor returns null for invalid ceiling type", () => {
    const uFactor = getUFactor("InvalidCeiling", "No Insulation");
    expect(uFactor).toBeNull();
  });

  test("getUFactor returns null for invalid construction", () => {
    const uFactor = getUFactor("Ventilated Attic", "InvalidConstruction");
    expect(uFactor).toBeNull();
  });

  test("calculateHeatTransferMultiplier calculates correctly", () => {
    const multiplier = calculateHeatTransferMultiplier(
      "Ventilated Attic",
      "No Insulation",
      15,
    );
    expect(multiplier).toBe(8.985); // 0.599 * 15
  });

  test("calculateHeatTransferMultiplier returns null for invalid ceiling type", () => {
    const multiplier = calculateHeatTransferMultiplier(
      "InvalidCeiling",
      "No Insulation",
      15,
    );
    expect(multiplier).toBeNull();
  });

  test("calculateHeatTransferMultiplier returns null for invalid construction", () => {
    const multiplier = calculateHeatTransferMultiplier(
      "Ventilated Attic",
      "InvalidConstruction",
      15,
    );
    expect(multiplier).toBeNull();
  });
});
