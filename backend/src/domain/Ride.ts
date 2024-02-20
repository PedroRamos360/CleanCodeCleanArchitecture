import crypto from "crypto";
import { PositionRepositoryDatabase } from "../infra/repository/PositionRepositoryDatabase";
import { PgPromiseAdapter } from "../infra/database/PgPromiseAdapter";

interface CreateRide {
  passengerId: string;
  fromLat: number;
  fromLong: number;
  toLat: number;
  toLong: number;
}

export class Ride {
  distance: number | null = null;
  fare: number | null = null;

  constructor(
    readonly rideId: string,
    readonly passengerId: string,
    private driverId: string,
    private status: string,
    readonly date: Date,
    readonly fromLat: number,
    readonly fromLong: number,
    readonly toLat: number,
    readonly toLong: number
  ) {}

  static create(input: CreateRide) {
    const rideId = crypto.randomUUID();
    const date = new Date();
    const status = "requested";
    return new Ride(
      rideId,
      input.passengerId,
      "",
      status,
      date,
      input.fromLat,
      input.fromLong,
      input.toLat,
      input.toLong
    );
  }

  accept(driverId: string) {
    this.driverId = driverId;
    this.status = "accepted";
  }

  start() {
    this.status = "in_progress";
  }

  finish() {
    this.status = "completed";
  }

  getDriverId() {
    return this.driverId;
  }

  getStatus() {
    return this.status;
  }
}
