import { masonryWallHeatTransferMultipliers } from "./masonryWalls";

describe.each(masonryWallHeatTransferMultipliers)(
  "for wall type: $wallType, insulation: $insulation",
  ({
    uFactorAboveGrade,
    htmByTemperatureAboveGrade,
    uFactorCrawlspace,
    htmByTemperatureCrawlspace,
    uFactorBasement,
    htmByTemperatureBasement,
  }) => {
    if (uFactorAboveGrade && htmByTemperatureAboveGrade) {
      describe("above grade", () => {
        const testCases = Object.entries(htmByTemperatureAboveGrade).map(
          ([temperature, htm]) => ({
            temperature: parseInt(temperature, 10),
            htm,
          })
        );

        it.each(testCases)(
          "the htm for temperature $temperature should be within 5% of the product of uFactor and temperature",
          ({ temperature, htm }) => {
            const expectedHtm = uFactorAboveGrade * temperature;
            const lowerBound = expectedHtm * 0.95;
            const upperBound = expectedHtm * 1.05;
            expect(htm).toBeGreaterThanOrEqual(lowerBound);
            expect(htm).toBeLessThanOrEqual(upperBound);
          }
        );
      });
    }

    if (uFactorCrawlspace && htmByTemperatureCrawlspace) {
      describe("crawlspace", () => {
        const testCases = Object.entries(htmByTemperatureCrawlspace).map(
          ([temperature, htm]) => ({
            temperature: parseInt(temperature, 10),
            htm,
          })
        );

        it.each(testCases)(
          "the htm for temperature $temperature should be within 10% of the product of uFactor and temperature",
          ({ temperature, htm }) => {
            const expectedHtm = uFactorCrawlspace * temperature;
            const lowerBound = expectedHtm * 0.9;
            const upperBound = expectedHtm * 1.1;
            expect(htm).toBeGreaterThanOrEqual(lowerBound);
            expect(htm).toBeLessThanOrEqual(upperBound);
          }
        );
      });
    }

    if (uFactorBasement && htmByTemperatureBasement) {
      describe("basement", () => {
        const testCases = Object.entries(htmByTemperatureBasement).map(
          ([temperature, htm]) => ({
            temperature: parseInt(temperature, 10),
            htm,
          })
        );

        it.each(testCases)(
          "the htm for temperature $temperature should be within 5% of the product of uFactor and temperature",
          ({ temperature, htm }) => {
            const expectedHtm = uFactorBasement * temperature;
            const lowerBound = expectedHtm * 0.95;
            const upperBound = expectedHtm * 1.05;
            expect(htm).toBeGreaterThanOrEqual(lowerBound);
            expect(htm).toBeLessThanOrEqual(upperBound);
          }
        );
      });
    }
  }
);