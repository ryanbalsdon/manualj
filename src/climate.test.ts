// src/climate.test.ts
import { Climate } from "./climate";

describe("Climate", () => {
  let climate: Climate;

  beforeEach(() => {
    climate = new Climate();
  });

  it("initializes with default values", () => {
    expect(climate.state).toBeDefined();
    expect(climate.location).toBeDefined();
  });

  it("sets and gets valid states", () => {
    const states = climate.validStates;
    expect(states.length).toBeGreaterThan(0);

    climate.state = states[1];
    expect(climate.state).toBe(states[1]);
  });

  it("handles invalid states", () => {
    const originalState = climate.state;
    climate.state = "invalid-state";
    expect(climate.state).toBe(originalState);
  });

  it("handles empty states", () => {
    const originalState = climate.state;
    climate.state = "";
    expect(climate.state).toBe(originalState);
  });

  it("updates location when state changes", () => {
    const newState = climate.validStates[1];
    const originalLocation = climate.location;

    climate.state = newState;
    expect(climate.location).not.toBe(originalLocation);
    expect(climate.validLocations).toContain(climate.location);
  });

  it("gets winter design temperature correctly", () => {
    const temperature = climate.winterDesignTemperature;
    expect(temperature).toBeDefined();
  });

  it("handles invalid locations gracefully", () => {
    // Test with empty string
    climate.location = "";
    expect(climate.location).not.toBe("");
    expect(climate.location).toBeDefined();

    // Test with undefined value
    climate.location = undefined as unknown as string;
    expect(climate.location).not.toBeUndefined();
    expect(climate.location).toBeDefined();

    // Test with null value
    climate.location = null as unknown as string;
    expect(climate.location).not.toBeNull();
    expect(climate.location).toBeDefined();
  });

  it("sets location with valid value", () => {
    const newLocation = climate.validLocations[1];
    climate.location = newLocation;
    expect(climate.location).toBe(newLocation);
  });

  it("resets to default location when invalid value is provided", () => {
    const originalLocation = climate.location;
    climate.location = "invalid-location";
    expect(climate.location).not.toBe("invalid-location");
    expect(climate.location).toBe(originalLocation);
  });

  it("throws error for invalid combination in heat loss calculation", () => {
    // Force invalid combination by direct assignment
    const climate = new Climate();
    (climate as any)._state = "invalid";
    (climate as any)._location = "invalid";

    expect(() => climate.winterDesignTemperature).toThrow(
      "Could not find WInter Design Temperature for combination",
    );
  });
});
