import { Ceiling } from "./houseComponents/ceiling";
import { Door } from "./houseComponents/door";
import { Floor } from "./houseComponents/floor";
import { Infiltration } from "./houseComponents/infiltration";
import { MasonryWall } from "./houseComponents/masonryWall";
import { Wall } from "./houseComponents/wall";
import { Window } from "./houseComponents/window";

export class House {
  ceiling: Ceiling;
  door: Door;
  floor: Floor;
  masonryWall: MasonryWall;
  wall: Wall;
  window: Window;
  infiltration: Infiltration;

  constructor() {
    this.ceiling = new Ceiling();
    this.door = new Door();
    this.floor = new Floor();
    this.masonryWall = new MasonryWall();
    this.wall = new Wall();
    this.window = new Window();
    this.infiltration = new Infiltration();
  }

  calculateHeatLoss(temperatureDifference: number): number {
    let totalHeatLoss = 0;

    totalHeatLoss += this.ceiling.calculateHeatLoss(temperatureDifference);
    totalHeatLoss += this.door.calculateHeatLoss(temperatureDifference);
    totalHeatLoss += this.floor.calculateHeatLoss(temperatureDifference);
    totalHeatLoss += this.masonryWall.calculateHeatLoss(temperatureDifference);
    totalHeatLoss += this.wall.calculateHeatLoss(temperatureDifference);
    totalHeatLoss += this.window.calculateHeatLoss(temperatureDifference);
    totalHeatLoss += this.infiltration.calculateHeatLoss(temperatureDifference);

    return totalHeatLoss;
  }
}
