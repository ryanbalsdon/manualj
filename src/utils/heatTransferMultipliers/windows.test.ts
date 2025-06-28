import {
  getWindowTypes,
  getGlassTypesForWindowType,
  getFrameTypesForWindowAndGlass,
  getUFactorForWindow,
  calculateWindowHeatTransferMultiplier,
} from "./windows";

describe("Window Heat Transfer Utilities", () => {
  test("getWindowTypes returns all window types", () => {
    const windowTypes = getWindowTypes();
    expect(windowTypes).toEqual([
      "Single Pane Window",
      "Single Pane Window & Storm",
      "Double Pane Window",
      "Double Pane Window & Storm",
      "Triple Pane Window",
      "Jalousie Windows",
      "Skylights",
    ]);
  });

  test("getGlassTypesForWindowType returns glass types for Single Pane Window", () => {
    const glassTypes = getGlassTypesForWindowType("Single Pane Window");
    expect(glassTypes).toEqual([
      "Clear Glass",
      "Low Emittance Glass, e = 0.60",
      "Low Emittance Glass, e = 0.40",
      "Low Emittance Glass, e = 0.20",
    ]);
  });

  test("getGlassTypesForWindowType returns empty array for invalid window type", () => {
    const glassTypes = getGlassTypesForWindowType("InvalidWindowType");
    expect(glassTypes).toEqual([]);
  });

  test("getFrameTypesForWindowAndGlass returns frame types for Single Pane Window with Clear Glass", () => {
    const frameTypes = getFrameTypesForWindowAndGlass(
      "Single Pane Window",
      "Clear Glass",
    );
    expect(frameTypes).toEqual(["Wood Frame", "T.I.M. Frame", "Metal Frame"]);
  });

  test("getFrameTypesForWindowAndGlass returns empty array for invalid window type", () => {
    const frameTypes = getFrameTypesForWindowAndGlass(
      "InvalidWindow",
      "Clear Glass",
    );
    expect(frameTypes).toEqual([]);
  });

  test("getFrameTypesForWindowAndGlass returns empty array for invalid glass type", () => {
    const frameTypes = getFrameTypesForWindowAndGlass(
      "Single Pane Window",
      "InvalidGlass",
    );
    expect(frameTypes).toEqual([]);
  });

  test("getUFactorForWindow returns correct U-factor for known combination", () => {
    const uFactor = getUFactorForWindow(
      "Single Pane Window",
      "Clear Glass",
      "Wood Frame",
    );
    expect(uFactor).toBe(0.99);
  });

  test("getUFactorForWindow returns null for invalid window type", () => {
    const uFactor = getUFactorForWindow(
      "InvalidWindow",
      "Clear Glass",
      "Wood Frame",
    );
    expect(uFactor).toBeNull();
  });

  test("getUFactorForWindow returns null for invalid glass type", () => {
    const uFactor = getUFactorForWindow(
      "Single Pane Window",
      "InvalidGlass",
      "Wood Frame",
    );
    expect(uFactor).toBeNull();
  });

  test("getUFactorForWindow returns null for invalid frame type", () => {
    const uFactor = getUFactorForWindow(
      "Single Pane Window",
      "Clear Glass",
      "InvalidFrame",
    );
    expect(uFactor).toBeNull();
  });

  test("calculateWindowHeatTransferMultiplier calculates correctly", () => {
    const multiplier = calculateWindowHeatTransferMultiplier(
      "Single Pane Window",
      "Clear Glass",
      "Wood Frame",
      20,
    );
    expect(multiplier).toBe(19.8); // 0.99 * 20
  });

  test("calculateWindowHeatTransferMultiplier returns null for invalid window type", () => {
    const multiplier = calculateWindowHeatTransferMultiplier(
      "InvalidWindow",
      "Clear Glass",
      "Wood Frame",
      20,
    );
    expect(multiplier).toBeNull();
  });

  test("calculateWindowHeatTransferMultiplier returns null for invalid glass type", () => {
    const multiplier = calculateWindowHeatTransferMultiplier(
      "Single Pane Window",
      "InvalidGlass",
      "Wood Frame",
      20,
    );
    expect(multiplier).toBeNull();
  });

  test("calculateWindowHeatTransferMultiplier returns null for invalid frame type", () => {
    const multiplier = calculateWindowHeatTransferMultiplier(
      "Single Pane Window",
      "Clear Glass",
      "InvalidFrame",
      20,
    );
    expect(multiplier).toBeNull();
  });
});
