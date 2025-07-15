import { Door } from "./door";

describe("Door", () => {
  let door: Door;

  beforeEach(() => {
    door = new Door();
  });

  it("initializes with default values", () => {
    expect(door.doorType).toBe("Sliding Glass Doors");
    expect(door.glassType).toBe("Single Pane, Clear Glass");
    expect(door.frameType).toBe("Wood Frame");
    expect(door.area).toBe(0);
  });

  it("sets and gets valid door types", () => {
    const types = door.validDoorTypes;
    expect(types).toEqual([
      "Sliding Glass Doors",
      "French Doors",
      "Wood Doors",
      "Metal Doors",
    ]);

    door.doorType = types[1];
    expect(door.doorType).toBe(types[1]);
  });

  it("handles invalid door types", () => {
    const originalType = door.doorType;
    door.doorType = "invalid-type";
    expect(door.doorType).toBe(originalType);
  });

  it("handles empty door types", () => {
    const originalType = door.doorType;
    door.doorType = "";
    expect(door.doorType).toBe(originalType);
  });

  it("resets glass and frame type when door type changes", () => {
    door.doorType = door.validDoorTypes[1];
    door.glassType = door.validGlassTypes[1];
    door.frameType = door.validFrameTypes[1];

    const originalGlassType = door.glassType;
    const originalFrameType = door.frameType;
    door.doorType = door.validDoorTypes[0];
    expect(door.glassType).not.toBe(originalGlassType);
    expect(door.frameType).not.toBe(originalFrameType);
  });

  it("sets and gets valid glass types", () => {
    const types = door.validGlassTypes;
    expect(types).toEqual([
      "Single Pane, Clear Glass",
      'Single Pane, Low "e" Glass',
      "Single Pane & Storm, Clear Glass",
      'Single Pane & Storm, Low "e" Glass',
      "Double Pane, Clear Glass",
      'Double Pane, Low "e" Glass',
      "Triple Pane or Double Pane & Storm",
      'Triple or Double & Storm, Low "e"',
    ]);

    door.glassType = types[1];
    expect(door.glassType).toBe(types[1]);
  });

  it("handles invalid glass types", () => {
    const originalType = door.glassType;
    door.glassType = "invalid-type";
    expect(door.glassType).toBe(originalType);
  });

  it("handles empty glass types", () => {
    const originalType = door.glassType;
    door.glassType = "";
    expect(door.glassType).toBe(originalType);
  });

  it("resets frame type when glass type changes", () => {
    door.doorType = door.validDoorTypes[1];
    door.glassType = door.validGlassTypes[1];
    door.frameType = door.validFrameTypes[1];

    const originalFrameType = door.frameType;
    door.glassType = door.validGlassTypes[2];
    expect(door.frameType).not.toBe(originalFrameType);
  });

  it("sets and gets valid frame types", () => {
    const types = door.validFrameTypes;
    expect(types).toEqual(["Wood Frame", "T.I.M. Frame", "Metal Frame"]);

    door.frameType = types[1];
    expect(door.frameType).toBe(types[1]);
  });

  it("handles invalid frame types", () => {
    const originalType = door.frameType;
    door.frameType = "invalid-type";
    expect(door.frameType).toBe(originalType);
  });

  it("handles empty frame types", () => {
    const originalType = door.frameType;
    door.frameType = "";
    expect(door.frameType).toBe(originalType);
  });

  it("calculates heat loss correctly", () => {
    door.area = 1;
    expect(door.calculateHeatLoss(20)).toBeCloseTo(19.8);
  });

  it("throws error for invalid combination in heat loss calculation", () => {
    // Force invalid combination by direct assignment
    const testDoor = new Door();
    (testDoor as any)._doorType = "invalid";
    (testDoor as any)._glassType = "invalid";
    (testDoor as any)._frameType = "invalid";

    expect(() => testDoor.calculateHeatLoss(20)).toThrow(
      "Could not calculate heat transfer multiplier for combination: invalid, invalid, invalid",
    );
  });

  it("passes some specific examples", () => {
    door.doorType = "Metal Doors";
    door.glassType = "N/A";
    door.frameType = "Urethane Core";
    door.area = 37;
    expect(door.calculateHeatLoss(75)).toBeCloseTo(529.1);
  });
});
