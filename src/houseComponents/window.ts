import {
  getWindowTypes,
  getGlassTypesForWindowType,
  getFrameTypesForWindowAndGlass,
  calculateWindowHeatTransferMultiplier,
} from "@/repository/windows";

export class Window {
  private _windowType: string;
  private _glassType: string;
  private _frameType: string;
  public area: number;

  constructor() {
    const windowTypes = getWindowTypes();
    this._windowType = windowTypes[0];

    const glassTypes = getGlassTypesForWindowType(this._windowType);
    this._glassType = glassTypes[0];

    const frameTypes = getFrameTypesForWindowAndGlass(
      this._windowType,
      this._glassType,
    );
    this._frameType = frameTypes[0];

    this.area = 0;
  }

  get validWindowTypes(): Array<string> {
    return getWindowTypes();
  }

  set windowType(value: string) {
    const validTypes = this.validWindowTypes;
    if (!value) {
      this._windowType = validTypes[0];
    } else if (!validTypes.includes(value)) {
      this._windowType = validTypes[0];
    } else {
      this._windowType = value;
    }

    this.glassType = this.validGlassTypes[0];
    this.frameType = this.validFrameTypes[0];
  }

  get windowType(): string {
    return this._windowType;
  }

  get validGlassTypes(): Array<string> {
    return getGlassTypesForWindowType(this._windowType);
  }

  set glassType(value: string) {
    const validTypes = this.validGlassTypes;
    if (!value) {
      this._glassType = validTypes[0];
    } else if (!validTypes.includes(value)) {
      this._glassType = validTypes[0];
    } else {
      this._glassType = value;
    }

    this.frameType = this.validFrameTypes[0];
  }

  get glassType(): string {
    return this._glassType;
  }

  get validFrameTypes(): Array<string> {
    return getFrameTypesForWindowAndGlass(this._windowType, this._glassType);
  }

  set frameType(value: string) {
    const validTypes = this.validFrameTypes;
    if (!value) {
      this._frameType = validTypes[0];
    } else if (
      !getFrameTypesForWindowAndGlass(
        this._windowType,
        this._glassType,
      ).includes(value)
    ) {
      this._frameType = validTypes[0];
    } else {
      this._frameType = value;
    }
  }

  get frameType(): string {
    return this._frameType;
  }

  calculateHeatLoss(temperatureDifference: number): number {
    const heatTransferMultiplier = calculateWindowHeatTransferMultiplier(
      this._windowType,
      this._glassType,
      this._frameType,
      temperatureDifference,
    );

    if (heatTransferMultiplier === null) {
      throw new Error(
        `Could not calculate heat transfer multiplier for combination: ${this._windowType}, ${this._glassType}, ${this._frameType}`,
      );
    }

    return this.area * heatTransferMultiplier;
  }
}
