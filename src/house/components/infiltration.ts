import {
  Tightness,
  airChangesPerHour,
  infiltrationCfm,
  infiltrationHeatLoss,
} from "@/utils/infiltration";
export { Tightness } from "@/utils/infiltration";

export class Infiltration {
  private _tightness: Tightness;
  public floorAreaIncludingBasement: number;
  public aboveGradeVolume: number;
  public fireplaces: number;

  constructor() {
    this._tightness = Tightness.Average;
    this.floorAreaIncludingBasement = 0;
    this.aboveGradeVolume = 0;
    this.fireplaces = 0;
  }

  get tightness(): Tightness {
    return this._tightness;
  }

  set tightness(value: Tightness) {
    if (!Object.values(Tightness).includes(value)) {
      this._tightness = Tightness.Average;
    } else {
      this._tightness = value;
    }
  }

  calculateHeatLoss(temperatureDifference: number): number {
    const airChanges = airChangesPerHour(
      this.tightness,
      this.floorAreaIncludingBasement,
      this.fireplaces,
    );
    const cfm = infiltrationCfm(airChanges, this.aboveGradeVolume);
    return infiltrationHeatLoss(cfm, temperatureDifference);
  }
}
