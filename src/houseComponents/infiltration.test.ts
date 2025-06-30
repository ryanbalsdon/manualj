// src/houseComponents/infiltration.test.ts
import { Infiltration, Tightness } from "./infiltration";

describe("Infiltration", () => {
  let infiltration: Infiltration;

  beforeEach(() => {
    infiltration = new Infiltration();
  });

  describe("tightness", () => {
    it("should default to Average tightness", () => {
      expect(infiltration.tightness).toBe(Tightness.Average);
    });

    it("should update when valid value is set", () => {
      infiltration.tightness = Tightness.Best;
      expect(infiltration.tightness).toBe(Tightness.Best);
    });

    it("should reset to Average when invalid value is set", () => {
      infiltration.tightness = "Invalid" as unknown as Tightness;
      expect(infiltration.tightness).toBe(Tightness.Average);
    });
  });

  describe("calculateHeatLoss", () => {
    it("should calculate heat loss based on temperature difference", () => {
      infiltration.tightness = Tightness.Poor;
      infiltration.floorAreaIncludingBasement = 1500;
      infiltration.aboveGradeVolume = 1500 * 8;
      infiltration.fireplaces = 2;

      const heatLoss = infiltration.calculateHeatLoss(20);
      expect(heatLoss).toBe(10581.12);
    });

    it("passes some specific examples", () => {
      infiltration.tightness = Tightness.Average;
      infiltration.floorAreaIncludingBasement = 1479 * 2;
      infiltration.aboveGradeVolume = 1479 * 11;
      infiltration.fireplaces = 0;

      const heatLoss = infiltration.calculateHeatLoss(75);
      expect(heatLoss).toBeCloseTo(15690.23033);
    });
  });
});