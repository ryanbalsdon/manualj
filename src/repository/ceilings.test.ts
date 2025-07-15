import {
  getCeilingTypes,
  getConstructionsForCeilingType,
  getCeilingData,
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

  test("getCeilingData returns correct U-factor and htmByTemperature for known combination", () => {
    const ceilingData = getCeilingData("Ventilated Attic", "No Insulation");
    expect(ceilingData?.uFactor).toBe(0.599);
    expect(ceilingData?.htmByTemperature).toBeDefined();
    expect(ceilingData?.htmByTemperature[20]).toBe(12.0);
  });

  test("getCeilingData returns null for invalid ceiling type", () => {
    const ceilingData = getCeilingData("InvalidCeiling", "No Insulation");
    expect(ceilingData).toBeNull();
  });

  test("getCeilingData returns null for invalid construction", () => {
    const ceilingData = getCeilingData(
      "Ventilated Attic",
      "InvalidConstruction",
    );
    expect(ceilingData).toBeNull();
  });

  test("calculateHeatTransferMultiplier interpolates correctly within range", () => {
    const multiplier = calculateHeatTransferMultiplier(
      "Ventilated Attic",
      "No Insulation",
      22.5, // Between 20 (12.0) and 25 (15.0)
    );
    expect(multiplier).toBeCloseTo(13.5);
  });

  test("calculateHeatTransferMultiplier falls back to uFactor for out-of-range tempDifference (below min)", () => {
    const multiplier = calculateHeatTransferMultiplier(
      "Ventilated Attic",
      "No Insulation",
      10, // Below minTemp of 20
    );
    expect(multiplier).toBeCloseTo(5.99);
  });

  test("calculateHeatTransferMultiplier falls back to uFactor for out-of-range tempDifference (above max)", () => {
    const multiplier = calculateHeatTransferMultiplier(
      "Ventilated Attic",
      "No Insulation",
      100, // Above maxTemp of 95
    );
    expect(multiplier).toBeCloseTo(59.9);
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
