export function interpolateHeatTransferMultiplier(
  htmByTemperature: { [key: number]: number },
  tempDifference: number,
  uFactor: number,
): number {
  const temperatures = Object.keys(htmByTemperature)
    .map(Number)
    .sort((a, b) => a - b);
  const minTemp = temperatures[0];
  const maxTemp = temperatures[temperatures.length - 1];

  if (tempDifference < minTemp || tempDifference > maxTemp) {
    return uFactor * tempDifference; // Fallback to uFactor
  }

  let lowerTemp = minTemp;
  let upperTemp = maxTemp;

  for (let i = 0; i < temperatures.length; i++) {
    if (temperatures[i] <= tempDifference) {
      lowerTemp = temperatures[i];
    }
    if (temperatures[i] >= tempDifference) {
      upperTemp = temperatures[i];
      break;
    }
  }

  if (lowerTemp === upperTemp) {
    return htmByTemperature[lowerTemp];
  }

  const lowerHtm = htmByTemperature[lowerTemp];
  const upperHtm = htmByTemperature[upperTemp];

  const interpolatedHtm =
    lowerHtm +
    ((upperHtm - lowerHtm) * (tempDifference - lowerTemp)) /
      (upperTemp - lowerTemp);

  return interpolatedHtm;
}
