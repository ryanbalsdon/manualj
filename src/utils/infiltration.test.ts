import { Tightness, airChangesPerHour, infiltrationCfm, infiltrationHeatLoss } from './infiltration';

describe('airChangesPerHour', () => {
  it('should calculate air changes per hour for small floor area with Best tightness', () => {
    expect(airChangesPerHour(Tightness.Best, 800)).toBeCloseTo(0.4);
  });

  it('should calculate air changes per hour for medium floor area with Average tightness', () => {
    expect(airChangesPerHour(Tightness.Average, 1200)).toBeCloseTo(1.0);
  });

  it('should calculate air changes per hour for large floor area with Poor tightness', () => {
    expect(airChangesPerHour(Tightness.Poor, 2000)).toBeCloseTo(1.2);
  });

  it('should include fireplace air changes in calculation', () => {
    expect(airChangesPerHour(Tightness.Best, 800, 2)).toBeCloseTo(0.6);
  });

  it('should handle zero fireplaces correctly', () => {
    expect(airChangesPerHour(Tightness.Poor, 3000, 0)).toBeCloseTo(1);
  });

  it('should return zero for invalid tightness values', () => {
    expect(airChangesPerHour(99 as Tightness, 800)).toBe(0);
    expect(airChangesPerHour(99 as Tightness, 1400)).toBe(0);
    expect(airChangesPerHour(99 as Tightness, 2000)).toBe(0);
    expect(airChangesPerHour(99 as Tightness, 2200)).toBe(0);
  });
});

describe('infiltrationCfm', () => {
  it('should calculate infiltration CFM correctly for different air changes per hour and volumes', () => {
    expect(infiltrationCfm(1, 1000)).toBeCloseTo(16.7);
    expect(infiltrationCfm(2, 500)).toBeCloseTo(16.7 * 2 / 2); // Simplified for testing
    expect(infiltrationCfm(3, 2000)).toBeCloseTo(3 * 2000 * 0.0167);
    expect(infiltrationCfm(4, 3000)).toBeCloseTo(4 * 3000 * 0.0167);
  });

  it('should handle zero air changes per hour correctly', () => {
    expect(infiltrationCfm(0, 5000)).toBe(0);
  });
});

describe('infiltrationHeatLoss', () => {
  it('should calculate infiltration heat loss correctly for different CFM and temperature differences', () => {
    expect(infiltrationHeatLoss(10, 20)).toBeCloseTo(1.1 * 10 * 20);
    expect(infiltrationHeatLoss(5, 30)).toBeCloseTo(1.1 * 5 * 30);
    expect(infiltrationHeatLoss(8, 15)).toBeCloseTo(1.1 * 8 * 15);
    expect(infiltrationHeatLoss(2, 40)).toBeCloseTo(1.1 * 2 * 40);
  });

  it('should handle zero infiltration CFM correctly', () => {
    expect(infiltrationHeatLoss(0, 50)).toBe(0);
  });
});