import {
  getMasonryWallTypes,
  getInsulationTypesForMasonryWallType,
  getMasonryWallData,
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

  test("getMasonryWallData returns correct U-factors and htmByTemperature for known combination", () => {
    const masonryWallData = getMasonryWallData('8" or 12" Block', "None");
    expect(masonryWallData?.uFactorAboveGrade).toBe(0.51);
    expect(masonryWallData?.uFactorCrawlspace).toBe(0.125);
    expect(masonryWallData?.uFactorBasement).toBe(0.087);
    expect(masonryWallData?.htmByTemperatureAboveGrade).toBeDefined();
    expect(masonryWallData?.htmByTemperatureAboveGrade[20]).toBe(10.2);
    expect(masonryWallData?.htmByTemperatureCrawlspace).toBeDefined();
    expect(masonryWallData?.htmByTemperatureCrawlspace?.[20]).toBe(2.5);
    expect(masonryWallData?.htmByTemperatureBasement).toBeDefined();
    expect(masonryWallData?.htmByTemperatureBasement?.[20]).toBe(1.7);
  });

  test("getMasonryWallData returns null for invalid wall type", () => {
    const masonryWallData = getMasonryWallData("InvalidWall", "None");
    expect(masonryWallData).toBeNull();
  });

  test("getMasonryWallData returns null for invalid insulation type", () => {
    const masonryWallData = getMasonryWallData('8" or 12" Block', "Invalid");
    expect(masonryWallData).toBeNull();
  });

  describe("calculateMasonryWallHeatTransferMultiplier", () => {
    test("calculates correctly for above grade only (feetBelowGrade <= 2)", () => {
      const multiplier =
        calculateMasonryWallHeatTransferMultiplierPerLinearFoot(
          '8" or 12" Block',
          "None",
          10,
          1,
          70,
        );
      expect(multiplier).toBeCloseTo(392.7);
    });

    test("calculates correctly for crawlspace (feetBelowGrade 2-5)", () => {
      const multiplier =
        calculateMasonryWallHeatTransferMultiplierPerLinearFoot(
          '8" or 12" Block',
          "None",
          5,
          3,
          70,
        );
      expect(multiplier).toBeCloseTo(204.6);
    });

    test("calculates correctly for basement (feetBelowGrade > 5)", () => {
      const multiplier =
        calculateMasonryWallHeatTransferMultiplierPerLinearFoot(
          '8" or 12" Block',
          "None",
          5,
          6,
          70,
        );
      expect(multiplier).toBeCloseTo(215.1);
    });

    test("returns null for invalid wall type", () => {
      const multiplier =
        calculateMasonryWallHeatTransferMultiplierPerLinearFoot(
          "InvalidWall",
          "None",
          10,
          0,
          70,
        );
      expect(multiplier).toBeNull();
    });

    test("returns null for invalid insulation type", () => {
      const multiplier =
        calculateMasonryWallHeatTransferMultiplierPerLinearFoot(
          '8" or 12" Block',
          "Invalid",
          10,
          0,
          70,
        );
      expect(multiplier).toBeNull();
    });

    test("returns 0 if totalFeet is 0", () => {
      const multiplier =
        calculateMasonryWallHeatTransferMultiplierPerLinearFoot(
          '8" or 12" Block',
          "None",
          0,
          0,
          70,
        );
      expect(multiplier).toBe(0);
    });

    test("calculates correctly when htmByTemperatureCrawlspace is null for '4\" Brick + 8\" Block' and feetBelowGrade 2-5", () => {
      const multiplier =
        calculateMasonryWallHeatTransferMultiplierPerLinearFoot(
          '4" Brick + 8" Block',
          "None",
          5,
          3,
          70,
        );
      expect(multiplier).toBeCloseTo(140);
    });

    test("calculates correctly when htmByTemperatureBasement is null for '4\" Brick + 8\" Block' and feetBelowGrade > 5", () => {
      const multiplier =
        calculateMasonryWallHeatTransferMultiplierPerLinearFoot(
          '4" Brick + 8" Block',
          "None",
          5,
          6,
          70,
        );
      expect(multiplier).toBeCloseTo(140);
    });

    test("passes a specific example", () => {
      const multiplier =
        calculateMasonryWallHeatTransferMultiplierPerLinearFoot(
          '8" or 12" Block',
          "R-5",
          3,
          5,
          75,
        );
      expect(multiplier).toBeCloseTo(59.9);
    });

    test("calculates correctly when htmByTemperatureCrawlspace is null for '4\" Brick + 8\" Block' with R-5 and feetBelowGrade 2-5", () => {
      const multiplier =
        calculateMasonryWallHeatTransferMultiplierPerLinearFoot(
          '4" Brick + 8" Block',
          "R-5",
          5,
          3,
          70,
        );
      expect(multiplier).toBeCloseTo(46.5);
    });

    test("calculates correctly when htmByTemperatureBasement is null for '4\" Brick + 8\" Block' with R-5 and feetBelowGrade > 5", () => {
      const multiplier =
        calculateMasonryWallHeatTransferMultiplierPerLinearFoot(
          '4" Brick + 8" Block',
          "R-5",
          5,
          6,
          70,
        );
      expect(multiplier).toBeCloseTo(46.5);
    });
  });
});
