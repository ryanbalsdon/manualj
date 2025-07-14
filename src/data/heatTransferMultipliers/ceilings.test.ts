import { ceilingHeatTransferMultipliers } from "./ceilings";

describe.each(ceilingHeatTransferMultipliers)(
  "for ceiling construction: $construction, type: $ceilingType",
  ({ uFactor, htmByTemperature }) => {
    const testCases = Object.entries(htmByTemperature).map(
      ([temperature, htm]) => ({
        temperature: parseInt(temperature, 10),
        htm,
      }),
    );

    it.each(testCases)(
      "the htm for temperature $temperature should be within 12% of the product of uFactor and temperature",
      ({ temperature, htm }) => {
        const expectedHtm = uFactor * temperature;
        const lowerBound = expectedHtm * 0.88;
        const upperBound = expectedHtm * 1.12;
        expect(htm).toBeGreaterThanOrEqual(lowerBound);
        expect(htm).toBeLessThanOrEqual(upperBound);
      },
    );
  },
);
