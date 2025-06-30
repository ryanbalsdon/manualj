import { Wall } from "./wall";

describe("Wall", () => {
  let wall: Wall;

  beforeEach(() => {
    wall = new Wall();
  });

  it("initializes with default values", () => {
    expect(wall.cavityInsulation).toBe("None");
    expect(wall.sheathing).toBe('½" Gypsum Brd (R-0.5)');
    expect(wall.area).toBe(0);
  });

  it("sets and gets valid cavity insulation types", () => {
    const types = wall.validCavityInsulationTypes;
    expect(types).toEqual([
      "None",
      "R-11",
      "R-13",
      "R-19",
      "R-27",
      "R-30",
      "R-33",
    ]);

    wall.cavityInsulation = types[1];
    expect(wall.cavityInsulation).toBe(types[1]);
  });

  it("handles invalid cavity insulation types", () => {
    const originalType = wall.cavityInsulation;
    wall.cavityInsulation = "invalid-type";
    expect(wall.cavityInsulation).toBe(originalType);
  });

  it("handles empty cavity insulation types", () => {
    const originalType = wall.cavityInsulation;
    wall.cavityInsulation = "";
    expect(wall.cavityInsulation).toBe(originalType);
  });

  it("resets sheathing when cavity insulation changes", () => {
    wall.sheathing = "Vinyl Siding";
    wall.cavityInsulation = "R-11";
    expect(wall.sheathing).toBe('½" Gypsum (R-0.5)');
  });

  it("sets and gets valid sheathing types", () => {
    const types = wall.validSheathingTypes;
    expect(types).toEqual(['½" Gypsum Brd (R-0.5)', '½" Asphalt Brd (R-1.3)']);

    wall.sheathing = types[1];
    expect(wall.sheathing).toBe(types[1]);
  });

  it("handles invalid sheathing types", () => {
    const originalType = wall.sheathing;
    wall.sheathing = "invalid-type";
    expect(wall.sheathing).toBe(originalType);
  });

  it("handles empty sheathing types", () => {
    const originalType = wall.sheathing;
    wall.sheathing = "";
    expect(wall.sheathing).toBe(originalType);
  });

  it("calculates heat loss correctly", () => {
    wall.area = 1;
    expect(wall.calculateHeatLoss(20)).toBeCloseTo(5.42);
  });

  it("throws error for invalid combination in heat loss calculation", () => {
    // Force invalid combination by direct assignment
    const testWall = new Wall();
    (testWall as any)._cavityInsulation = "invalid";
    (testWall as any)._sheathing = "invalid";

    expect(() => testWall.calculateHeatLoss(20)).toThrow(
      "Could not find U-Factor for combination",
    );
  });

  it("passes some specific examples", () => {
    wall.cavityInsulation = "R-11";
    wall.sheathing = '½" Asphalt Brd (R-1.3)';
    wall.area = 1078;
    expect(wall.calculateHeatLoss(75)).toBeCloseTo(6468);
  });
});
