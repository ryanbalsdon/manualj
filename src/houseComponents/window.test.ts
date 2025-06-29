import { Window } from "./window";

describe("Window", () => {
  let window: Window;

  beforeEach(() => {
    window = new Window();
  });

  it("initializes with default values", () => {
    expect(window.windowType).toBe("Single Pane Window");
    expect(window.glassType).toBe("Clear Glass");
    expect(window.frameType).toBe("Wood Frame");
    expect(window.area).toBe(0);
  });

  it("sets and gets valid window types", () => {
    const types = window.validWindowTypes;
    expect(types).toEqual([
      "Single Pane Window",
      "Single Pane Window & Storm",
      "Double Pane Window",
      "Double Pane Window & Storm",
      "Triple Pane Window",
      "Jalousie Windows",
      "Skylights",
    ]);

    window.windowType = types[1];
    expect(window.windowType).toBe(types[1]);
  });

  it("handles invalid window types", () => {
    const originalType = window.windowType;
    window.windowType = "invalid-type";
    expect(window.windowType).toBe(originalType);
  });

  it("handles empty window types", () => {
    const originalType = window.windowType;
    window.windowType = "";
    expect(window.windowType).toBe(originalType);
  });

  it("resets glass and frame type when window type changes", () => {
    window.windowType = window.validWindowTypes[1];
    window.glassType = window.validGlassTypes[1];
    window.frameType = window.validFrameTypes[1];

    const originalGlassType = window.glassType;
    const originalFrameType = window.frameType;
    window.windowType = window.validWindowTypes[0];
    expect(window.glassType).not.toBe(originalGlassType);
    expect(window.frameType).not.toBe(originalFrameType);
  });

  it("sets and gets valid glass types", () => {
    const types = window.validGlassTypes;
    expect(types).toEqual([
      "Clear Glass",
      "Low Emittance Glass, e = 0.60",
      "Low Emittance Glass, e = 0.40",
      "Low Emittance Glass, e = 0.20",
    ]);

    window.glassType = types[1];
    expect(window.glassType).toBe(types[1]);
  });

  it("handles invalid glass types", () => {
    const originalType = window.glassType;
    window.glassType = "invalid-type";
    expect(window.glassType).toBe(originalType);
  });

  it("handles empty glass types", () => {
    const originalType = window.glassType;
    window.glassType = "";
    expect(window.glassType).toBe(originalType);
  });

  it("resets frame type when window type changes", () => {
    window.windowType = window.validWindowTypes[1];
    window.glassType = window.validGlassTypes[1];
    window.frameType = window.validFrameTypes[1];

    const originalFrameType = window.frameType;
    window.glassType = window.validGlassTypes[0];
    expect(window.frameType).not.toBe(originalFrameType);
  });

  it("sets and gets valid frame types", () => {
    const types = window.validFrameTypes;
    expect(types).toEqual(["Wood Frame", "T.I.M. Frame", "Metal Frame"]);

    window.frameType = types[1];
    expect(window.frameType).toBe(types[1]);
  });

  it("handles invalid frame types", () => {
    const originalType = window.frameType;
    window.frameType = "invalid-type";
    expect(window.frameType).toBe(originalType);
  });

  it("handles empty frame types", () => {
    const originalType = window.frameType;
    window.frameType = "";
    expect(window.frameType).toBe(originalType);
  });

  it("calculates heat loss correctly", () => {
    window.area = 1;
    expect(window.calculateHeatLoss()).toBeCloseTo(0.99);
  });

  it("throws error for invalid combination in heat loss calculation", () => {
    // Force invalid combination by direct assignment
    const win = new Window();
    (win as any)._windowType = "invalid";
    (win as any)._glassType = "invalid";
    (win as any)._frameType = "invalid";

    expect(() => win.calculateHeatLoss()).toThrow(
      "Could not find U-Factor for combination",
    );
  });
});
