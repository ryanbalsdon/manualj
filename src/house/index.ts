import { Ceiling } from "./components/ceiling";
import { Door } from "./components/door";
import { Floor } from "./components/floor";
import { Infiltration } from "./components/infiltration";
import { MasonryWall } from "./components/masonryWall";
import { Wall } from "./components/wall";
import { Window } from "./components/window";

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
