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
}
