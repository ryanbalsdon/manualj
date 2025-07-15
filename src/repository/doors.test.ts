import {
  getDoorTypes,
  getGlassTypesForDoorType,
  getFrameTypesForWindowAndGlass,
  getDoorData,
  calculateHeatTransferMultiplier,
} from "./doors";

describe("Door Heat Transfer Utilities", () => {
  test("getDoorTypes returns all door types", () => {
    const doorTypes = getDoorTypes();
    expect(doorTypes).toEqual([
      "Sliding Glass Doors",
      "French Doors",
      "Wood Doors",
      "Metal Doors",
    ]);
  });

  test("getGlassTypesForDoorType returns glass types for Sliding Glass Doors", () => {
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

  test("getGlassTypesForDoorType returns empty array for invalid door type", () => {
    const glassTypes = getGlassTypesForDoorType("InvalidDoorType");
    expect(glassTypes).toEqual([]);
  });

  test("getFrameTypesForWindowAndGlass returns frame types for Sliding Glass Doors with Single Pane, Clear Glass", () => {
    const frameTypes = getFrameTypesForWindowAndGlass(
      "Sliding Glass Doors",
      "Single Pane, Clear Glass",
    );
    expect(frameTypes).toEqual(["Wood Frame", "T.I.M. Frame", "Metal Frame"]);
  });

  test("getFrameTypesForWindowAndGlass returns empty array for invalid door type", () => {
    const frameTypes = getFrameTypesForWindowAndGlass(
      "InvalidDoorType",
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

  test("getDoorData returns correct U-factor and htmByTemperature for known combination", () => {
    const doorData = getDoorData(
      "Sliding Glass Doors",
      "Single Pane, Clear Glass",
      "Wood Frame",
    );
    expect(doorData?.uFactor).toBe(0.99);
    expect(doorData?.htmByTemperature).toBeDefined();
    expect(doorData?.htmByTemperature[20]).toBe(19.8);
  });

  test("getDoorData returns null for invalid door type", () => {
    const doorData = getDoorData(
      "InvalidDoor",
      "Single Pane, Clear Glass",
      "Wood Frame",
    );
    expect(doorData).toBeNull();
  });

  test("getDoorData returns null for invalid glass type", () => {
    const doorData = getDoorData(
      "Sliding Glass Doors",
      "InvalidGlass",
      "Wood Frame",
    );
    expect(doorData).toBeNull();
  });

  test("getDoorData returns null for invalid frame type", () => {
    const doorData = getDoorData(
      "Sliding Glass Doors",
      "Single Pane, Clear Glass",
      "InvalidFrame",
    );
    expect(doorData).toBeNull();
  });

  test("calculateHeatTransferMultiplier interpolates correctly within range", () => {
    const multiplier = calculateHeatTransferMultiplier(
      "Sliding Glass Doors",
      "Single Pane, Clear Glass",
      "Wood Frame",
      22.5, // Between 20 (19.8) and 25 (24.8)
    );
    expect(multiplier).toBeCloseTo(22.3);
  });

  test("calculateHeatTransferMultiplier falls back to uFactor for out-of-range tempDifference (below min)", () => {
    const multiplier = calculateHeatTransferMultiplier(
      "Sliding Glass Doors",
      "Single Pane, Clear Glass",
      "Wood Frame",
      10, // Below minTemp of 20
    );
    expect(multiplier).toBeCloseTo(9.9);
  });

  test("calculateHeatTransferMultiplier falls back to uFactor for out-of-range tempDifference (above max)", () => {
    const multiplier = calculateHeatTransferMultiplier(
      "Sliding Glass Doors",
      "Single Pane, Clear Glass",
      "Wood Frame",
      100, // Above maxTemp of 95
    );
    expect(multiplier).toBeCloseTo(99.0);
  });

  test("calculateHeatTransferMultiplier returns null for invalid door type", () => {
    const multiplier = calculateHeatTransferMultiplier(
      "InvalidDoor",
      "Single Pane, Clear Glass",
      "Wood Frame",
      15,
    );
    expect(multiplier).toBeNull();
  });

  test("calculateHeatTransferMultiplier returns null for invalid glass type", () => {
    const multiplier = calculateHeatTransferMultiplier(
      "Sliding Glass Doors",
      "InvalidGlass",
      "Wood Frame",
      15,
    );
    expect(multiplier).toBeNull();
  });

  test("calculateHeatTransferMultiplier returns null for invalid frame type", () => {
    const multiplier = calculateHeatTransferMultiplier(
      "Sliding Glass Doors",
      "Single Pane, Clear Glass",
      "InvalidFrame",
      15,
    );
    expect(multiplier).toBeNull();
  });
});
