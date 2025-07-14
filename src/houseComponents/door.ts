import {
  getDoorTypes as getDoorTypes,
  getGlassTypesForDoorType,
  getFrameTypesForWindowAndGlass,
  calculateHeatTransferMultiplier,
} from "@/utils/heatTransferMultipliers/doors";

export class Door {
  private _doorType: string;
  private _glassType: string;
  private _frameType: string;
  public area: number;

  constructor() {
    const doorTypes = getDoorTypes();
    this._doorType = doorTypes[0];

    const glassTypes = getGlassTypesForDoorType(this._doorType);
    this._glassType = glassTypes[0];

    const frameTypes = getFrameTypesForWindowAndGlass(
      this._doorType,
      this._glassType,
    );
    this._frameType = frameTypes[0];

    this.area = 0;
  }

  get validDoorTypes(): string[] {
    return getDoorTypes();
  }

  set doorType(value: string) {
    const validTypes = this.validDoorTypes;
    if (!value || !validTypes.includes(value)) {
      this._doorType = validTypes[0];
    } else {
      this._doorType = value;
    }

    this.glassType = this.validGlassTypes[0];
    this.frameType = this.validFrameTypes[0];
  }

  get doorType(): string {
    return this._doorType;
  }

  get validGlassTypes(): string[] {
    return getGlassTypesForDoorType(this._doorType);
  }

  set glassType(value: string) {
    const validTypes = this.validGlassTypes;
    if (!value || !validTypes.includes(value)) {
      this._glassType = validTypes[0];
    } else {
      this._glassType = value;
    }

    this.frameType = this.validFrameTypes[0];
  }

  get glassType(): string {
    return this._glassType;
  }

  get validFrameTypes(): string[] {
    return getFrameTypesForWindowAndGlass(this._doorType, this._glassType);
  }

  set frameType(value: string) {
    const validTypes = this.validFrameTypes;
    if (!value || !validTypes.includes(value)) {
      this._frameType = validTypes[0];
    } else {
      this._frameType = value;
    }
  }

  get frameType(): string {
    return this._frameType;
  }

  calculateHeatLoss(temperatureDifference: number): number {
    const heatTransferMultiplier = calculateHeatTransferMultiplier(
      this._doorType,
      this._glassType,
      this._frameType,
      temperatureDifference,
    );

    if (heatTransferMultiplier === null) {
      throw new Error(
        `Could not calculate heat transfer multiplier for combination: ${this._doorType}, ${this._glassType}, ${this._frameType}`,
      );
    }

    return this.area * heatTransferMultiplier;
  }
}
