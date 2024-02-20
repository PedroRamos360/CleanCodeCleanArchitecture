import crypto from "crypto";

export class Position {
  positionId: string;
  date: Date;

  constructor(
    readonly rideId: string,
    readonly lat: number,
    readonly long: number
  ) {
    this.positionId = crypto.randomUUID();
    this.date = new Date();
  }

  static restore(
    positionId: string,
    rideId: string,
    lat: number,
    long: number,
    date: Date
  ) {
    const position = new Position(rideId, lat, long);
    position.positionId = positionId;
    position.date = date;
    return position;
  }
}
