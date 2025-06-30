import {
  getDoorTypes,
  getGlassTypesForDoorType,
  getFrameTypesForWindowAndGlass,
  getUFactor,
  calculateHeatTransferMultiplier,
} from "./doors";

describe("Door Heat Transfer Utilities", () => {
  test("getWindowTypes returns all window types", () => {
    const windowTypes = getDoorTypes();
    expect(windowTypes).toEqual([
      "Sliding Glass Doors",
      "French Doors",
      "Wood Doors",
      "Metal Doors",
    ]);
  });

  test("getGlassTypesForWindowType returns glass types for Sliding Glass Doors", () => {
    const glassTypes = getGlassTypesForDoorType("Sliding Glass Doors");
    expect(glassTypes).toEqual([
      "Single Pane, Clear Glass",
      'Single Pane, Low "e" Glass',
      "Single Pane & Storm, Clear Glass",
      'Single Pane & Storm, Low "e" Glass',
      "Double Pane, Clear Glass",
      'Double Pane, Low "e" Glass',
      "Triple Pane or Double Pane & Storm",
      'Triple or Double & Storm, Low "e"',
    ]);
  });

  test("getGlassTypesForWindowType returns empty array for invalid window type", () => {
    const glassTypes = getGlassTypesForDoorType("InvalidWindowType");
    expect(glassTypes).toEqual([]);
  });

  test("getFrameTypesForWindowAndGlass returns frame types for Sliding Glass Doors with Single Pane, Clear Glass", () => {
    const frameTypes = getFrameTypesForWindowAndGlass(
      "Sliding Glass Doors",
      "Single Pane, Clear Glass",
    );
    expect(frameTypes).toEqual(["Wood Frame", "T.I.M. Frame", "Metal Frame"]);
  });

  test("getFrameTypesForWindowAndGlass returns empty array for invalid window type", () => {
    const frameTypes = getFrameTypesForWindowAndGlass(
      "InvalidWindowType",
      "Single Pane, Clear Glass",
    );
    expect(frameTypes).toEqual([]);
  });

  test("getFrameTypesForWindowAndGlass returns empty array for invalid glass type", () => {
    const frameTypes = getFrameTypesForWindowAndGlass(
      "Sliding Glass Doors",
      "InvalidGlassType",
    );
    expect(frameTypes).toEqual([]);
  });

  test("getUFactor returns correct U-factor for known combination", () => {
    const uFactor = getUFactor(
      "Sliding Glass Doors",
      "Single Pane, Clear Glass",
      "Wood Frame",
    );
    expect(uFactor).toBe(0.99);
  });

  test("getUFactor returns null for invalid window type", () => {
    const uFactor = getUFactor(
      "InvalidWindow",
      "Single Pane, Clear Glass",
      "Wood Frame",
    );
    expect(uFactor).toBeNull();
  });

  test("getUFactor returns null for invalid glass type", () => {
    const uFactor = getUFactor(
      "Sliding Glass Doors",
      "InvalidGlass",
      "Wood Frame",
    );
    expect(uFactor).toBeNull();
  });

  test("getUFactor returns null for invalid frame type", () => {
    const uFactor = getUFactor(
      "Sliding Glass Doors",
      "Single Pane, Clear Glass",
      "InvalidFrame",
    );
    expect(uFactor).toBeNull();
  });

  test("calculateHeatTransferMultiplier calculates correctly", () => {
    const multiplier = calculateHeatTransferMultiplier(
      "Sliding Glass Doors",
      "Single Pane, Clear Glass",
      "Wood Frame",
      20,
    );
    expect(multiplier).toBe(19.8); // 0.99 * 20
  });

  test("calculateHeatTransferMultiplier returns null for invalid window type", () => {
    const multiplier = calculateHeatTransferMultiplier(
      "InvalidWindow",
      "Single Pane, Clear Glass",
      "Wood Frame",
      20,
    );
    expect(multiplier).toBeNull();
  });

  test("calculateHeatTransferMultiplier returns null for invalid glass type", () => {
    const multiplier = calculateHeatTransferMultiplier(
      "Sliding Glass Doors",
      "InvalidGlass",
      "Wood Frame",
      20,
    );
    expect(multiplier).toBeNull();
  });

  test("calculateHeatTransferMultiplier returns null for invalid frame type", () => {
    const multiplier = calculateHeatTransferMultiplier(
      "Sliding Glass Doors",
      "Single Pane, Clear Glass",
      "InvalidFrame",
      20,
    );
    expect(multiplier).toBeNull();
  });
});
