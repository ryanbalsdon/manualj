import { Floor } from "./floor";

describe("Floor", () => {
  let floor: Floor;

  beforeEach(() => {
    floor = new Floor();
  });

  it("initializes with default values", () => {
    expect(floor.floorType).toBe("Unheated Basement or Crawl Space");
    expect(floor.constructionType).toBe("Hardwood Floor");
    expect(floor.insulationRValue).toBe("No Insulation");
    expect(floor.area).toBe(0);
  });

  it("sets and gets valid floor types", () => {
    const types = floor.validFloorTypes;
    expect(types).toEqual([
      "Unheated Basement or Crawl Space",
      "Open Crawl Space or Garage",
      "Basement Floors",
      "Concrete Slab on Grade",
      "Concrete Slab with Perimeter Warm Air Duct System",
    ]);

    floor.floorType = types[1];
    expect(floor.floorType).toBe(types[1]);
  });

  it("handles invalid floor types", () => {
    const originalType = floor.floorType;
    floor.floorType = "invalid-type";
    expect(floor.floorType).toBe(originalType);
  });

  it("handles empty floor types", () => {
    const originalType = floor.floorType;
    floor.floorType = "";
    expect(floor.floorType).toBe(originalType);
  });

  it("resets construction and insulation when floor type changes", () => {
    floor.constructionType = floor.validConstructionTypes[1];
    floor.insulationRValue = floor.validInsulationTypes[1];

    const originalConstruction = floor.constructionType;
    const originalInsulation = floor.insulationRValue;

    floor.floorType = "Concrete Slab on Grade";

    expect(floor.constructionType).not.toBe(originalConstruction);
    expect(floor.insulationRValue).not.toBe(originalInsulation);
  });

  it("sets and gets valid construction types", () => {
    const types = floor.validConstructionTypes;
    expect(types).toEqual(["Hardwood Floor", "Carpeted Floor"]);

    floor.constructionType = types[1];
    expect(floor.constructionType).toBe(types[1]);
  });

  it("handles invalid construction types", () => {
    const originalType = floor.constructionType;
    floor.constructionType = "invalid-type";
    expect(floor.constructionType).toBe(originalType);
  });

  it("handles empty construction types", () => {
    const originalType = floor.constructionType;
    floor.constructionType = "";
    expect(floor.constructionType).toBe(originalType);
  });

  it("resets insulation when construction type changes", () => {
    floor.constructionType = floor.validConstructionTypes[1];
    floor.insulationRValue = floor.validInsulationTypes[1];

    const originalInsulation = floor.insulationRValue;
    floor.constructionType = floor.validConstructionTypes[0];

    expect(floor.insulationRValue).not.toBe(originalInsulation);
  });

  it("sets and gets valid insulation types", () => {
    const types = floor.validInsulationTypes;
    expect(types).toEqual(["No Insulation", "R-11", "R-13", "R-19", "R-30"]);

    floor.insulationRValue = types[1];
    expect(floor.insulationRValue).toBe(types[1]);
  });

  it("handles invalid insulation types", () => {
    const originalType = floor.insulationRValue;
    floor.insulationRValue = "invalid-type";
    expect(floor.insulationRValue).toBe(originalType);
  });

  it("handles empty insulation types", () => {
    const originalType = floor.insulationRValue;
    floor.insulationRValue = "";
    expect(floor.insulationRValue).toBe(originalType);
  });

  it("calculates heat loss correctly", () => {
    floor.area = 1;
    expect(floor.calculateHeatLoss(20)).toBeCloseTo(6.24);
  });

  it("throws error for invalid combination in heat loss calculation", () => {
    const testFloor = new Floor();
    (testFloor as any)._floorType = "invalid";
    (testFloor as any)._constructionType = "invalid";
    (testFloor as any)._insulationRValue = "invalid";

    expect(() => testFloor.calculateHeatLoss(20)).toThrow(
      "Could not find U-Factor for combination",
    );
  });

  it("passes some specific examples", () => {
    floor.floorType = "Basement Floors";
    floor.constructionType = "Below Grade";
    floor.insulationRValue = "N/A";
    floor.area = 1479;
    expect(floor.calculateHeatLoss(75)).toBeCloseTo(2662.2);
  });
});
