import { wallHeatTransferMultipliers } from "./walls";

describe.each(wallHeatTransferMultipliers)(
  "for wall with cavity insulation: $cavityInsulation and sheathing: $sheathing",
  ({ cavityInsulation, sheathing, uFactor, htmByTemperature }) => {
    const testCases = Object.entries(htmByTemperature).map(
      ([temperature, htm]) => ({
        temperature: parseInt(temperature, 10),
        htm,
      })
    );

    it.each(testCases)(
      "the htm for temperature $temperature should be within 7% of the product of uFactor and temperature",
      ({ temperature, htm }) => {
        const expectedHtm = uFactor * temperature;
        const lowerBound = expectedHtm * 0.93;
        const upperBound = expectedHtm * 1.07;
        expect(htm).toBeGreaterThanOrEqual(lowerBound);
        expect(htm).toBeLessThanOrEqual(upperBound);
      }
    );
  }
);