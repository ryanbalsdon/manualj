import { House, Climate, Tightness } from "../src/index";

describe("calculateHeatLoss", () => {
  it("default values return zero", () => {
    const house = new House();
    const climate = new Climate();

    expect(climate.winterDesignTemperature).toBeCloseTo(22);
    const temperatureDifference = 70 - climate.winterDesignTemperature;
    expect(house.calculateHeatLoss(temperatureDifference)).toBeCloseTo(0);
  });

  it("reproduces example data", () => {
    const house = new House();
    const climate = new Climate();

    climate.state = "NOVA SCOTIA";
    climate.location = "Truro CO";

    house.window.windowType = "Double Pane Window";
    house.window.glassType = "Clear Glass";
    house.window.frameType = "Wood Frame";
    house.window.area = 174;

    house.door.doorType = "Metal Doors";
    house.door.glassType = "N/A";
    house.door.frameType = "Urethane Core";
    house.door.area = 37;

    house.wall.cavityInsulation = "R-11";
    house.wall.sheathing = '½" Asphalt Brd (R-1.3)';
    house.wall.area = 1078;

    house.masonryWall.wallType = '8" or 12" Block';
    house.masonryWall.insulation = 'R-5';
    house.masonryWall.feetAboveGrade = 3;
    house.masonryWall.feetBelowGrade = 5;
    house.masonryWall.length = 160;

    house.ceiling.ceilingType = "Ventilated Attic";
    house.ceiling.construction = "R-19 Insulation";
    house.ceiling.area = 1479;

    house.floor.floorType = "Basement Floors";
    house.floor.constructionType = "Below Grade";
    house.floor.insulationRValue = "N/A";
    house.floor.area = 1479;

    house.infiltration.tightness = Tightness.Average;
    house.infiltration.floorAreaIncludingBasement = 1479 * 2;
    house.infiltration.aboveGradeVolume = 1479 * 11;

    expect(climate.winterDesignTemperature).toBeCloseTo(-5);
    const temperatureDifference = 70 - climate.winterDesignTemperature;
    expect(house.calculateHeatLoss(temperatureDifference)).toBeCloseTo(48041.25533);
  });
});
