import { floorHeatTransferMultipliers } from "./floors";

const unheatedBasementOrCrawlSpaceFloors = floorHeatTransferMultipliers.filter(
  (floor) => floor.floorType === "Unheated Basement or Crawl Space",
);
const otherFloors = floorHeatTransferMultipliers.filter(
  (floor) => floor.floorType !== "Unheated Basement or Crawl Space",
);

describe.each(unheatedBasementOrCrawlSpaceFloors)(
  "for floor type: $floorType, construction: $constructionType, insulation: $insulationRValue",
  ({ uFactor, htmByTemperature }) => {
    const testCases = Object.entries(htmByTemperature).map(
      ([temperature, htm]) => ({
        temperature: parseInt(temperature, 10),
        htm,
      }),
    );

    it.each(testCases)(
      "the htm for temperature $temperature should be within 15% of half the product of uFactor and temperature",
      ({ temperature, htm }) => {
        const expectedHtm = uFactor * temperature;
        // Floors over an unheated but closed basement or crawlspace have a much
        // smaller HTM than their UFactor implies because the unheated space acts
        // as insulation.
        const lowerBound = expectedHtm / 2.3;
        const upperBound = expectedHtm / 1.7;
        expect(htm).toBeGreaterThanOrEqual(lowerBound);
        expect(htm).toBeLessThanOrEqual(upperBound);
      },
    );
  },
);

describe.each(otherFloors)(
  "for floor type: $floorType, construction: $constructionType, insulation: $insulationRValue",
  ({ uFactor, htmByTemperature }) => {
    const testCases = Object.entries(htmByTemperature).map(
      ([temperature, htm]) => ({
        temperature: parseInt(temperature, 10),
        htm,
      }),
    );

    it.each(testCases)(
      "the htm for temperature $temperature should be within 6% of the product of uFactor and temperature",
      ({ temperature, htm }) => {
        const expectedHtm = uFactor * temperature;
        const lowerBound = expectedHtm * 0.94;
        const upperBound = expectedHtm * 1.06;
        expect(htm).toBeGreaterThanOrEqual(lowerBound);
        expect(htm).toBeLessThanOrEqual(upperBound);
      },
    );
  },
);
