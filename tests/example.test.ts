import { calculateRoomHeatLoad } from "../src/index";

describe("calculateHeatLoad", () => {
  it("should return a valid heat load value", () => {
    const result = calculateRoomHeatLoad("test");
    expect(result).toBeDefined();
  });
});
