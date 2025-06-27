import {
  getUniqueStates,
  getLocationsForState,
  getWinterDesignTemperature,
} from "./climate-utils";
import { climateData } from "./data/climate";

describe("climate-utils", () => {
  test("getUniqueStates returns all unique states", () => {
    const states = getUniqueStates();
    expect(states).toEqual([
      "ALABAMA",
      "ALASKA",
      "ARIZONA",
      "ARKANSAS",
      "CALIFORNIA",
      "WEST VIRGINIA",
      "WISCONSIN",
      "WYOMING",
      "COLORADO",
      "CONNECTICUT",
      "DELAWARE",
      "DISTRICT OF COLUMBIA",
      "FLORIDA",
      "GEORGIA",
      "HAWAII",
      "IDAHO",
      "ILLINOIS",
      "INDIANA",
      "IOWA",
      "KANSAS",
      "KENTUCKY",
      "LOUISIANA",
      "MAINE",
      "MARYLAND",
      "MASSACHUSETTS",
      "MICHIGAN",
      "MINNESOTA",
      "MISSISSIPPI",
      "MISSOURI",
      "MONTANA",
      "NEBRASKA",
      "NEVADA",
      "NEW HAMPSHIRE",
      "NEW JERSEY",
      "NEW MEXICO",
      "NEW YORK",
      "NORTH CAROLINA",
      "NORTH DAKOTA",
      "OHIO",
      "OKLAHOMA",
      "OREGON",
      "PENNSYLVANIA",
      "RHODE ISLAND",
      "SOUTH CAROLINA",
      "SOUTH DAKOTA",
      "TENNESSEE",
      "TEXAS",
      "UTAH",
      "VERMONT",
      "VIRGINIA",
      "WASHINGTON",
      "ALBERTA",
      "BRITISH COLUMBIA",
      "MANITOBA",
      "NEW BRUNSWICK",
      "NEWFOUNDLAND",
      "NORTHWEST TERR.",
      "NOVA SCOTIA",
      "ONTARIO",
      "PRINCE EDWARD ISLAND",
      "QUEBEC",
      "SASKATCHEWAN",
      "YUKON TERRITORY",
    ]);
  });

  test("getLocationsForState returns locations for existing state", () => {
    const locations = getLocationsForState("ONTARIO");
    expect(locations).toEqual([
      "Belleville",
      "Chatham",
      "Cornwall",
      "Hamilton",
      "Kaupuskasing AP (S)",
      "Kenora AP",
      "Kingston",
      "Kitchener",
      "London AP",
      "North Bay AP",
      "Oshawa",
      "Ottawa AP (S)",
      "Owen Sound",
      "Peterborough",
      "St. Catharines",
      "Sarnia",
      "Sault Ste. Marie AP",
      "Sudbury AP",
      "Thunder Bay AP",
      "Timmins AP",
      "Toronto AP (S)",
      "Windsor AP",
    ]);
  });

  test("getLocationsForState returns empty array for unknown state", () => {
    const locations = getLocationsForState("NonExistentState");
    expect(locations).toEqual([]);
  });

  test("getWinterDesignTemperature returns temperature for valid location", () => {
    const temp = getWinterDesignTemperature("ONTARIO", "Ottawa AP (S)");
    expect(temp).toBe(-13);
  });

  test("getWinterDesignTemperature returns null for unknown location", () => {
    const testState = climateData[0].state;
    const temp = getWinterDesignTemperature(testState, "NonExistentCity");
    expect(temp).toBeNull();
  });

  test("getWinterDesignTemperature returns null for unknown state", () => {
    const temp = getWinterDesignTemperature(
      "NonExistentState",
      "NonExistentCity",
    );
    expect(temp).toBeNull();
  });
});
