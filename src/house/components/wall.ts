import {
  calculateWallHeatTransferMultiplier,
  getCavityInsulationTypes,
  getSheathingTypesForCavityInsulation,
} from "@/repository/walls";

export class Wall {
  private _cavityInsulation: string;
  private _sheathing: string;
  public area: number;

  constructor() {
    const cavityInsulationTypes = getCavityInsulationTypes();
    this._cavityInsulation = cavityInsulationTypes[0];

    const sheathingTypes = getSheathingTypesForCavityInsulation(
      this._cavityInsulation,
    );
    this._sheathing = sheathingTypes[0];

    this.area = 0;
  }

  get validCavityInsulationTypes(): Array<string> {
    return getCavityInsulationTypes();
  }

  set cavityInsulation(value: string) {
    const validTypes = this.validCavityInsulationTypes;
    if (!value) {
      this._cavityInsulation = validTypes[0];
    } else if (!validTypes.includes(value)) {
      this._cavityInsulation = validTypes[0];
    } else {
      this._cavityInsulation = value;
    }

    this._sheathing = this.validSheathingTypes[0];
  }

  get cavityInsulation(): string {
    return this._cavityInsulation;
  }

  get validSheathingTypes(): Array<string> {
    return getSheathingTypesForCavityInsulation(this._cavityInsulation);
  }

  set sheathing(value: string) {
    const validTypes = this.validSheathingTypes;
    if (!value) {
      this._sheathing = validTypes[0];
    } else if (!validTypes.includes(value)) {
      this._sheathing = validTypes[0];
    } else {
      this._sheathing = value;
    }
  }

  get sheathing(): string {
    return this._sheathing;
  }

  calculateHeatLoss(temperatureDifference: number): number {
    const htm = calculateWallHeatTransferMultiplier(
      this._cavityInsulation,
      this._sheathing,
      temperatureDifference,
    );

    if (htm === null) {
      throw new Error(
        `Could not find U-Factor for combination: ${this._cavityInsulation}, ${this._sheathing}`,
      );
    }

    return this.area * htm;
  }
}
