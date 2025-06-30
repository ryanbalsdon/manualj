import {
  getMasonryWallTypes,
  getInsulationTypesForMasonryWallType,
  getUFactorsForMasonryWall,
  calculateMasonryWallHeatTransferMultiplierPerLinearFoot,
} from "./masonryWalls";

describe("Masonry Wall Heat Transfer Utilities", () => {
  test("getMasonryWallTypes returns all masonry wall types", () => {
    const wallTypes = getMasonryWallTypes();
    expect(wallTypes).toEqual(['8" or 12" Block', '4" Brick + 8" Block']);
  });

  test("getInsulationTypesForMasonryWallType returns insulation types for '8\" or 12\" Block'", () => {
    const insulationTypes =
      getInsulationTypesForMasonryWallType('8" or 12" Block');
    expect(insulationTypes).toEqual(["None", "R-5", "R-11", "R-19"]);
  });

  test("getInsulationTypesForMasonryWallType returns empty array for invalid wall type", () => {
    const insulationTypes =
      getInsulationTypesForMasonryWallType("InvalidWallType");
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
      const multiplier = calculateMasonryWallHeatTransferMultiplierPerLinearFoot(
        '8" or 12" Block',
        "None",
        10,
        1,
        70
      );
      expect(multiplier).toBeCloseTo(392.7);
    });

    test("calculates correctly for crawlspace (feetBelowGrade 2-5)", () => {
      const multiplier = calculateMasonryWallHeatTransferMultiplierPerLinearFoot(
        '8" or 12" Block',
        "None",
        5,
        3,
        70
      );
      expect(multiplier).toBeCloseTo(204.75);
    });

    test("calculates correctly for basement (feetBelowGrade > 5)", () => {
      const multiplier = calculateMasonryWallHeatTransferMultiplierPerLinearFoot(
        '8" or 12" Block',
        "None",
        5,
        6,
        70
      );
      expect(multiplier).toBeCloseTo(215.04);
    });

    test("returns null for invalid wall type", () => {
      const multiplier = calculateMasonryWallHeatTransferMultiplierPerLinearFoot(
        "InvalidWall",
        "None",
        10,
        0,
        70
      );
      expect(multiplier).toBeNull();
    });

    test("returns null for invalid insulation type", () => {
      const multiplier = calculateMasonryWallHeatTransferMultiplierPerLinearFoot(
        '8" or 12" Block',
        "Invalid",
        10,
        0,
        70
      );
      expect(multiplier).toBeNull();
    });

    test("returns 0 if totalFeet is 0", () => {
      const multiplier = calculateMasonryWallHeatTransferMultiplierPerLinearFoot(
        '8" or 12" Block',
        "None",
        0,
        0,
        70
      );
      expect(multiplier).toBe(0);
    });

    test("calculates correctly when uFactorCrawlspace is null for '4\" Brick + 8\" Block' and feetBelowGrade 2-5", () => {
      const multiplier = calculateMasonryWallHeatTransferMultiplierPerLinearFoot(
        '4" Brick + 8" Block',
        "None",
        5,
        3,
        70
      );
      expect(multiplier).toBeCloseTo(140);
    });

    test("calculates correctly when uFactorBasement is null for '4\" Brick + 8\" Block' and feetBelowGrade > 5", () => {
      const multiplier = calculateMasonryWallHeatTransferMultiplierPerLinearFoot(
        '4" Brick + 8" Block',
        "None",
        5,
        6,
        70
      );
      expect(multiplier).toBeCloseTo(140);
    });

    test("passes a specific example", () => {
      const multiplier = calculateMasonryWallHeatTransferMultiplierPerLinearFoot(
        '8" or 12" Block',
        "R-5",
        3,
        5,
        75
      );
 
      expect(multiplier).toBeCloseTo(60.15);
    });
  });
});
