import { Ceiling } from "./ceiling";

describe("Ceiling", () => {
  let ceiling: Ceiling;

  beforeEach(() => {
    ceiling = new Ceiling();
  });

  it("initializes with default values", () => {
    expect(ceiling.ceilingType).toBe("Ventilated Attic");
    expect(ceiling.construction).toBe("No Insulation");
    expect(ceiling.area).toBe(0);
  });

  it("sets and gets valid ceiling types", () => {
    const types = ceiling.validCeilingTypes;
    expect(types).toEqual([
      "Ventilated Attic",
      "Exposed Beams",
      "Roof-Ceiling Combination",
    ]);

    ceiling.ceilingType = types[1];
    expect(ceiling.ceilingType).toBe(types[1]);
  });

  it("handles invalid ceiling types", () => {
    const originalType = ceiling.ceilingType;
    ceiling.ceilingType = "invalid-type";
    expect(ceiling.ceilingType).toBe(originalType);
  });

  it("handles empty ceiling types", () => {
    const originalType = ceiling.ceilingType;
    ceiling.ceilingType = "";
    expect(ceiling.ceilingType).toBe(originalType);
  });

  it("resets construction when ceiling type changes", () => {
    ceiling.construction = "R-30";
    ceiling.ceilingType = "Cathedral Ceiling";
    expect(ceiling.construction).toBe("No Insulation");
  });

  it("sets and gets valid constructions", () => {
    const types = ceiling.validConstructions;
    expect(types).toEqual([
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

    ceiling.construction = types[1];
    expect(ceiling.construction).toBe(types[1]);
  });

  it("handles invalid constructions", () => {
    const originalType = ceiling.construction;
    ceiling.construction = "invalid-type";
    expect(ceiling.construction).toBe(originalType);
  });

  it("handles empty constructions", () => {
    const originalType = ceiling.construction;
    ceiling.construction = "";
    expect(ceiling.construction).toBe(originalType);
  });

  it("calculates heat loss correctly", () => {
    ceiling.area = 1;
    expect(ceiling.calculateHeatLoss(20)).toBeCloseTo(11.98);
  });

  it("throws error for invalid combination in heat loss calculation", () => {
    const testCeiling = new Ceiling();
    (testCeiling as any)._ceilingType = "invalid";
    (testCeiling as any)._construction = "invalid";

    expect(() => testCeiling.calculateHeatLoss(20)).toThrow(
      "Could not find U-Factor for combination",
    );
  });

  it("passes some specific examples", () => {
    ceiling.ceilingType = "Ventilated Attic";
    ceiling.construction = "R-19 Insulation";
    ceiling.area = 1479;
    expect(ceiling.calculateHeatLoss(75)).toBeCloseTo(5879.025);
  });
});
