import {
  getCeilingTypes,
  getConstructionsForCeilingType,
  calculateHeatTransferMultiplier,
} from "@/repository/ceilings";

export class Ceiling {
  private _ceilingType: string;
  private _construction: string;
  public area: number;

  constructor() {
    const ceilingTypes = getCeilingTypes();
    this._ceilingType = ceilingTypes[0];

    const constructions = getConstructionsForCeilingType(this._ceilingType);
    this._construction = constructions[0];

    this.area = 0;
  }

  get validCeilingTypes(): string[] {
    return getCeilingTypes();
  }

  set ceilingType(value: string) {
    const validTypes = this.validCeilingTypes;
    if (!value) {
      this._ceilingType = validTypes[0];
    } else if (!validTypes.includes(value)) {
      this._ceilingType = validTypes[0];
    } else {
      this._ceilingType = value;
    }

    this.construction = this.validConstructions[0];
  }

  get ceilingType(): string {
    return this._ceilingType;
  }

  get validConstructions(): string[] {
    return getConstructionsForCeilingType(this._ceilingType);
  }

  set construction(value: string) {
    const validTypes = this.validConstructions;
    if (!value) {
      this._construction = validTypes[0];
    } else if (!validTypes.includes(value)) {
      this._construction = validTypes[0];
    } else {
      this._construction = value;
    }
  }

  get construction(): string {
    return this._construction;
  }

  calculateHeatLoss(temperatureDifference: number): number {
    const htm = calculateHeatTransferMultiplier(
      this._ceilingType,
      this._construction,
      temperatureDifference,
    );

    if (htm === null) {
      throw new Error(
        `Could not find U-Factor for combination: ${this._ceilingType}, ${this._construction}`,
      );
    }

    return this.area * htm;
  }
}
