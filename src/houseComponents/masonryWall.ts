    import {
      getMasonryWallTypes,
      getInsulationTypesForMasonryWallType,
      calculateMasonryWallHeatTransferMultiplierPerLinearFoot,
    } from "@/utils/heatTransferMultipliers/masonryWalls";

    export class MasonryWall {
      private _wallType: string;
      private _insulation: string;
      public length: number;
      public feetAboveGrade: number;
      public feetBelowGrade: number;

      constructor() {
        const wallTypes = getMasonryWallTypes();
        this._wallType = wallTypes[0];

        const insulationTypes = getInsulationTypesForMasonryWallType(this._wallType);
        this._insulation = insulationTypes[0];

        this.length = 0;
        this.feetAboveGrade = 0;
        this.feetBelowGrade = 0;
      }

      get validMasonryWallTypes(): string[] {
        return getMasonryWallTypes();
      }

      set wallType(value: string) {
        const validTypes = this.validMasonryWallTypes;
        if (!value) {
          this._wallType = validTypes[0];
        } else if (!validTypes.includes(value)) {
          this._wallType = validTypes[0];
        } else {
          this._wallType = value;
        }

        this.insulation = getInsulationTypesForMasonryWallType(this._wallType)[0];
      }

      get wallType(): string {
        return this._wallType;
      }

      get validInsulationTypes(): string[] {
        return getInsulationTypesForMasonryWallType(this._wallType);
      }

      set insulation(value: string) {
        const validTypes = this.validInsulationTypes;
        if (!value) {
          this._insulation = validTypes[0];
        } else if (!validTypes.includes(value)) {
          this._insulation = validTypes[0];
        } else {
          this._insulation = value;
        }
      }

      get insulation(): string {
        return this._insulation;
      }

      calculateHeatLoss(temperatureDifference: number): number {
        const heatTransferPerLinearFoot = calculateMasonryWallHeatTransferMultiplierPerLinearFoot(
          this._wallType,
          this._insulation,
          this.feetAboveGrade,
          this.feetBelowGrade,
          temperatureDifference
        );

        if (heatTransferPerLinearFoot === null) {
           throw new Error(
            `Could not find heat transfer multiplier for combination: ${this._wallType}, ${this._insulation}, ${this.feetAboveGrade}ft above grade, ${this.feetBelowGrade}ft below grade`,
          );
        }

        return heatTransferPerLinearFoot * this.length;
      }
    }