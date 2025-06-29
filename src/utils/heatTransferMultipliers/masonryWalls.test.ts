import {
  getMasonryWallTypes,
  getInsulationTypesForMasonryWallType,
  getUFactorsForMasonryWall,
  calculateMasonryWallHeatTransferMultiplier,
} from "./masonryWalls";

describe("Masonry Wall Heat Transfer Utilities", () => {
  test("getMasonryWallTypes returns all masonry wall types", () => {
    const wallTypes = getMasonryWallTypes();
    expect(wallTypes).toEqual(['8" or 12" Block', '4" Brick + 8" Block']);
  });

  test("getInsulationTypesForMasonryWallType returns insulation types for '8\" or 12\" Block'", () => {
    const insulationTypes = getInsulationTypesForMasonryWallType(
      '8" or 12" Block',
    );
    expect(insulationTypes).toEqual(["None", "R-5", "R-11", "R-19"]);
  });

  test("getInsulationTypesForMasonryWallType returns empty array for invalid wall type", () => {
    const insulationTypes = getInsulationTypesForMasonryWallType(
      "InvalidWallType",
    );
    expect(insulationTypes).toEqual([]);
  });

  test("getUFactorsForMasonryWall returns correct U-factors for known combination", () => {
    const uFactors = getUFactorsForMasonryWall('8" or 12" Block', "None");
    expect(uFactors).toEqual({
      uFactorAboveGrade: 0.51,
      uFactorCrawlspace: 0.125,
      uFactorBasement: 0.087,
    });
  });

  test("getUFactorsForMasonryWall returns null for invalid wall type", () => {
    const uFactors = getUFactorsForMasonryWall("InvalidWall", "None");
    expect(uFactors).toBeNull();
  });

  test("getUFactorsForMasonryWall returns null for invalid insulation type", () => {
    const uFactors = getUFactorsForMasonryWall('8" or 12" Block', "Invalid");
    expect(uFactors).toBeNull();
  });

  describe("calculateMasonryWallHeatTransferMultiplier", () => {
    test("calculates correctly for above grade only (feetBelowGrade <= 2)", () => {
      const multiplier = calculateMasonryWallHeatTransferMultiplier(
        '8" or 12" Block',
        "None",
        20,
        10,
        1,
      );
      // (0.510 * 10 + 0.510 * 1) / 11 * 20 = 0.510 * 20 = 10.2
      expect(multiplier).toBeCloseTo(10.2);
    });

    test("calculates correctly for crawlspace (feetBelowGrade 2-5)", () => {
      const multiplier = calculateMasonryWallHeatTransferMultiplier(
        '8" or 12" Block',
        "None",
        20,
        5,
        3,
      );
      // (0.510 * 5 + 0.125 * 3) / 8 * 20 = (2.55 + 0.375) / 8 * 20 = 2.925 / 8 * 20 = 0.365625 * 20 = 7.3125
      expect(multiplier).toBeCloseTo(7.3125);
    });

    test("calculates correctly for basement (feetBelowGrade > 5)", () => {
      const multiplier = calculateMasonryWallHeatTransferMultiplier(
        '8" or 12" Block',
        "None",
        20,
        5,
        6,
      );
      // (0.510 * 5 + 0.087 * 6) / 11 * 20 = (2.55 + 0.522) / 11 * 20 = 3.072 / 11 * 20 = 0.2792727 * 20 = 5.585454
      expect(multiplier).toBeCloseTo(5.585454);
    });

    test("returns null for invalid wall type", () => {
      const multiplier = calculateMasonryWallHeatTransferMultiplier(
        "InvalidWall",
        "None",
        20,
        10,
        0,
      );
      expect(multiplier).toBeNull();
    });

    test("returns null for invalid insulation type", () => {
      const multiplier = calculateMasonryWallHeatTransferMultiplier(
        '8" or 12" Block',
        "Invalid",
        20,
        10,
        0,
      );
      expect(multiplier).toBeNull();
    });

    test("returns 0 if totalFeet is 0", () => {
      const multiplier = calculateMasonryWallHeatTransferMultiplier(
        '8" or 12" Block',
        "None",
        20,
        0,
        0,
      );
      expect(multiplier).toBe(0);
    });

    test("calculates correctly when uFactorCrawlspace is null for '4\" Brick + 8\" Block' and feetBelowGrade 2-5", () => {
      const multiplier = calculateMasonryWallHeatTransferMultiplier(
        '4" Brick + 8" Block',
        "None",
        20,
        5,
        3,
      );
      // (0.400 * 5 + 0 * 3) / 8 * 20 = 2 / 8 * 20 = 0.25 * 20 = 5
      expect(multiplier).toBeCloseTo(5);
    });

    test("calculates correctly when uFactorBasement is null for '4\" Brick + 8\" Block' and feetBelowGrade > 5", () => {
      const multiplier = calculateMasonryWallHeatTransferMultiplier(
        '4" Brick + 8" Block',
        "None",
        20,
        5,
        6,
      );
      // (0.400 * 5 + 0 * 6) / 11 * 20 = 2 / 11 * 20 = 0.181818 * 20 = 3.63636
      expect(multiplier).toBeCloseTo(3.63636);
    });
  });
});