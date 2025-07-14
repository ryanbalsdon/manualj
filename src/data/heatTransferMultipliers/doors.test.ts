import { doorHeatTransferMultipliers } from "./doors";

describe.each(doorHeatTransferMultipliers)(
  "for door type: $doorType, glass: $glassType, frame: $frameType",
  ({ uFactor, htmByTemperature }) => {
    const testCases = Object.entries(htmByTemperature).map(
      ([temperature, htm]) => ({
        temperature: parseInt(temperature, 10),
        htm,
      }),
    );

    it.each(testCases)(
      "the htm for temperature $temperature should be within 5% of the product of uFactor and temperature",
      ({ temperature, htm }) => {
        const expectedHtm = uFactor * temperature;
        const lowerBound = expectedHtm * 0.95;
        const upperBound = expectedHtm * 1.05;
        expect(htm).toBeGreaterThanOrEqual(lowerBound);
        expect(htm).toBeLessThanOrEqual(upperBound);
      },
    );
  },
);
