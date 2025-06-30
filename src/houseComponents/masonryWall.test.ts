import { MasonryWall } from "./masonryWall";

describe("MasonryWall", () => {
  let masonryWall: MasonryWall;

  beforeEach(() => {
    masonryWall = new MasonryWall();
  });

  it("initializes with default values", () => {
    expect(masonryWall.wallType).toBe('8" or 12" Block');
    expect(masonryWall.insulation).toBe("None");
    expect(masonryWall.length).toBe(0);
    expect(masonryWall.feetAboveGrade).toBe(0);
    expect(masonryWall.feetBelowGrade).toBe(0);
  });

  it("sets and gets valid wall types", () => {
    const types = masonryWall.validMasonryWallTypes;
    expect(types).toEqual([
      '8" or 12" Block',
      '4" Brick + 8" Block',
    ]);

    masonryWall.wallType = types[1];
    expect(masonryWall.wallType).toBe(types[1]);
  });

  it("handles invalid wall types", () => {
    const originalType = masonryWall.wallType;
    masonryWall.wallType = "invalid-type";
    expect(masonryWall.wallType).toBe(originalType);
  });

  it("handles empty wall types", () => {
    const originalType = masonryWall.wallType;
    masonryWall.wallType = "";
    expect(masonryWall.wallType).toBe(originalType);
  });

  it("resets insulation when wall type changes", () => {
    masonryWall.wallType = '4" Brick + 8" Block'; // Change to a different wall type
    expect(masonryWall.insulation).toBe("None"); // Should reset to default for '4" Brick + 8" Block'
  });

  it("sets and gets valid insulation types", () => {
    // Set wall type to one with multiple insulation options for testing
    masonryWall.wallType = '8" or 12" Block';
    const types = masonryWall.validInsulationTypes;
    expect(types).toEqual([
      "None",
      "R-5",
      "R-11",
      "R-19",
    ]);

    masonryWall.insulation = types[1];
    expect(masonryWall.insulation).toBe(types[1]);
  });

  it("handles invalid insulation types", () => {
    const originalType = masonryWall.insulation;
    masonryWall.insulation = "invalid-type";
    expect(masonryWall.insulation).toBe(originalType);
  });

  it("handles empty insulation types", () => {
    const originalType = masonryWall.insulation;
    masonryWall.insulation = "";
    expect(masonryWall.insulation).toBe(originalType);
  });

  it("calculates heat loss correctly for '8\" or 12\" Block' with 'R-5' insulation", () => {
    masonryWall.wallType = '8" or 12" Block';
    masonryWall.insulation = "R-5";
    masonryWall.length = 20;
    masonryWall.feetAboveGrade = 3;
    masonryWall.feetBelowGrade = 7;
    const tempDifference = 25;

    expect(masonryWall.calculateHeatLoss(tempDifference)).toBeCloseTo(422.5);
  });

  it("calculates heat loss correctly for '4\" Brick + 8\" Block' with 'None' insulation", () => {
    masonryWall.wallType = '4" Brick + 8" Block';
    masonryWall.insulation = "None";
    masonryWall.length = 15;
    masonryWall.feetAboveGrade = 5;
    masonryWall.feetBelowGrade = 0; // No below grade
    const tempDifference = 30;

    expect(masonryWall.calculateHeatLoss(tempDifference)).toBeCloseTo(900);
  });

  it("returns 0 heat loss if length is 0", () => {
    masonryWall.length = 0;
    masonryWall.wallType = '8" or 12" Block';
    masonryWall.insulation = "None";
    masonryWall.feetAboveGrade = 3;
    masonryWall.feetBelowGrade = 7;
    const tempDifference = 25;

    expect(masonryWall.calculateHeatLoss(tempDifference)).toBeCloseTo(0);
  });

   it("returns 0 heat loss if tempDifference is 0", () => {
    masonryWall.length = 20;
    masonryWall.wallType = '8" or 12" Block';
    masonryWall.insulation = "None";
    masonryWall.feetAboveGrade = 3;
    masonryWall.feetBelowGrade = 7;
    const tempDifference = 0;

    expect(masonryWall.calculateHeatLoss(tempDifference)).toBeCloseTo(0);
  });

   it("returns 0 heat loss if feetAboveGrade and feetBelowGrade are 0", () => {
    masonryWall.length = 20;
    masonryWall.wallType = '8" or 12" Block';
    masonryWall.insulation = "None";
    masonryWall.feetAboveGrade = 0;
    masonryWall.feetBelowGrade = 0;
    const tempDifference = 25;

    expect(masonryWall.calculateHeatLoss(tempDifference)).toBeCloseTo(0);
  });


  it("throws error if combination is not found", () => {
    masonryWall.length = 10;
    (masonryWall as any)._wallType = "invalid";
    (masonryWall as any)._insulation = "invalid";
    masonryWall.feetAboveGrade = 3;
    masonryWall.feetBelowGrade = 7;
    const tempDifference = 20;

    expect(() => masonryWall.calculateHeatLoss(tempDifference)).toThrow(
      "Could not find heat transfer multiplier for combination: invalid, invalid, 3ft above grade, 7ft below grade",
    );
  });

  it("passes some specific examples", () => {
    masonryWall.wallType = '8" or 12" Block';
    masonryWall.insulation = 'R-5';
    masonryWall.feetAboveGrade = 3;
    masonryWall.feetBelowGrade = 5;
    masonryWall.length = 160;
    expect(masonryWall.calculateHeatLoss(75)).toBeCloseTo(9624);
  });
});