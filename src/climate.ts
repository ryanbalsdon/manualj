// src/climate.ts
import {
  getUniqueStates,
  getLocationsForState,
  getWinterDesignTemperature,
} from "@/utils/climate";

export class Climate {
  private _state: string;
  private _location: string;

  constructor() {
    const states = getUniqueStates();
    this._state = states[0];

    const locations = getLocationsForState(this._state);
    this._location = locations[0];
  }

  get validStates(): string[] {
    return getUniqueStates();
  }

  set state(value: string) {
    const validStates = this.validStates;
    if (!value) {
      this._state = validStates[0];
    } else if (!validStates.includes(value)) {
      this._state = validStates[0];
    } else {
      this._state = value;

      // Update location to first available for new state
      const locations = getLocationsForState(this._state);
      this._location = locations[0];
    }
  }

  get state(): string {
    return this._state;
  }

  get validLocations(): string[] {
    return getLocationsForState(this._state);
  }

  set location(value: string) {
    const validLocations = this.validLocations;
    if (!value) {
      this._location = validLocations[0];
    } else if (!validLocations.includes(value)) {
      this._location = validLocations[0];
    } else {
      this._location = value;
    }
  }

  get location(): string {
    return this._location;
  }

  get winterDesignTemperature(): number {
    const winterDesignTemperature = getWinterDesignTemperature(this._state, this._location);

    if (winterDesignTemperature === null) {
      throw new Error(
        `Could not find WInter Design Temperature for combination: ${this._state}, ${this._location}`,
      );
    }

    return winterDesignTemperature;
  }
}