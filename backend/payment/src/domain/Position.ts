import crypto from "crypto";
import { Coord } from "./Coord";

export class Position {
  positionId: string;
  date: Date;

  constructor(readonly rideId: string, readonly coord: Coord) {
    this.positionId = crypto.randomUUID();
    this.date = new Date();
  }

  static restore(positionId: string, rideId: string, coord: Coord, date: Date) {
    const position = new Position(rideId, coord);
    position.positionId = positionId;
    position.date = date;
    return position;
  }
}
