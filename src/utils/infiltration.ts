export enum Tightness {
  "Best" = 0,
  "Average" = 1,
  "Poor" = 2,
}

export function airChangesPerHour(
  tightness: Tightness,
  floorArea: number,
  fireplaces: number = 0,
): number {
  return (
    floorAreaAirChanges(tightness, floorArea) +
    fireplaceAirChanges(tightness, fireplaces)
  );
}

function floorAreaAirChanges(tightness: Tightness, floorArea: number): number {
  if (floorArea < 900) {
    return [0.4, 1.2, 2.2][tightness] ?? 0;
  } else if (floorArea < 1500) {
    return [0.4, 1.0, 1.6][tightness] ?? 0;
  } else if (floorArea < 2100) {
    return [0.3, 0.8, 1.2][tightness] ?? 0;
  } else {
    return [0.3, 0.7, 1.0][tightness] ?? 0;
  }
}

function fireplaceAirChanges(tightness: Tightness, fireplaces: number): number {
  const airChangesPerFireplaceByTightness = [0.1, 0.2, 0.6];
  const airChangesPerFireplace =
    airChangesPerFireplaceByTightness[tightness] ?? 0;
  return airChangesPerFireplace * fireplaces;
}

export function infiltrationCfm(
  airChangesPerHour: number,
  totalVolume: number,
): number {
  return airChangesPerHour * totalVolume * 0.0167;
}

export function infiltrationHeatLoss(
  infiltrationCfm: number,
  temperatureDifference: number,
): number {
  return 1.1 * infiltrationCfm * temperatureDifference;
}
