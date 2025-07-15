import {
  getFloorTypes,
  getConstructionTypesForFloorType,
  getInsulationTypesForConstruction,
  calculateHeatTransferMultiplier,
} from "@/repository/floors";

export class Floor {
  private _floorType: string;
  private _constructionType: string;
  private _insulationRValue: string;
  public area: number;

  constructor() {
    const floorTypes = getFloorTypes();
    this._floorType = floorTypes[0]; // "Unheated Basement or Crawl Space"

    const constructionTypes = getConstructionTypesForFloorType(this._floorType);
    this._constructionType = constructionTypes[0]; // "Hardwood Floor"

    const insulationTypes = getInsulationTypesForConstruction(
      this._floorType,
      this._constructionType,
    );
    this._insulationRValue = insulationTypes[0]; // "No Insulation"

    this.area = 0;
  }

  get validFloorTypes(): string[] {
    return getFloorTypes();
  }

  set floorType(value: string) {
    const validTypes = this.validFloorTypes;
    if (!value) {
      this._floorType = validTypes[0];
    } else if (!validTypes.includes(value)) {
      this._floorType = validTypes[0];
    } else {
      this._floorType = value;
    }

    this.constructionType = this.validConstructionTypes[0];
    this.insulationRValue = this.validInsulationTypes[0];
  }

  get floorType(): string {
    return this._floorType;
  }

  get validConstructionTypes(): string[] {
    return getConstructionTypesForFloorType(this._floorType);
  }

  set constructionType(value: string) {
    const validTypes = this.validConstructionTypes;
    if (!value) {
      this._constructionType = validTypes[0];
    } else if (!validTypes.includes(value)) {
      this._constructionType = validTypes[0];
    } else {
      this._constructionType = value;
    }

    this.insulationRValue = this.validInsulationTypes[0];
  }

  get constructionType(): string {
    return this._constructionType;
  }

  get validInsulationTypes(): string[] {
    return getInsulationTypesForConstruction(
      this._floorType,
      this._constructionType,
    );
  }

  set insulationRValue(value: string) {
    const validTypes = this.validInsulationTypes;
    if (!value) {
      this._insulationRValue = validTypes[0];
    } else if (!validTypes.includes(value)) {
      this._insulationRValue = validTypes[0];
    } else {
      this._insulationRValue = value;
    }
  }

  get insulationRValue(): string {
    return this._insulationRValue;
  }

  calculateHeatLoss(temperatureDifference: number): number {
    const heatTransferMultiplier = calculateHeatTransferMultiplier(
      this._floorType,
      this._constructionType,
      this._insulationRValue,
      temperatureDifference,
    );

    if (heatTransferMultiplier === null) {
      throw new Error(
        `Could not calculate heat transfer multiplier for combination: ${this._floorType}, ${this._constructionType}, ${this._insulationRValue}`,
      );
    }

    return this.area * heatTransferMultiplier;
  }
}
