import crypto from "crypto";
import { RideStatus, RideStatusFactory } from "./RideStatus";
import { Position } from "./Position";
import { Coord } from "./Coord";
import { FareCalculatorFactory } from "./FareCalculator";
import { distanceBetweenPoints } from "../math/distanceBetweenPoints";
import Aggregate from "./Aggregate";
import { RideCompletedEvent } from "./event/RideCompletedEvent";

interface CreateRide {
  passengerId: string;
  fromLat: number;
  fromLong: number;
  toLat: number;
  toLong: number;
}

export class Ride extends Aggregate {
  status: RideStatus;

  constructor(
    readonly rideId: string,
    readonly passengerId: string,
    private driverId: string,
    status: string,
    readonly date: Date,
    readonly fromLat: number,
    readonly fromLong: number,
    readonly toLat: number,
    readonly toLong: number,
    private lastPosition?: Coord,
    private fare: number = 0,
    private distance: number = 0
  ) {
    super();
    this.status = RideStatusFactory.create(status, this);
  }

  static create({ fromLat, fromLong, toLat, toLong, passengerId }: CreateRide) {
    const rideId = crypto.randomUUID();
    const driverId = "";
    const status = "requested";
    const date = new Date();
    return new Ride(
      rideId,
      passengerId,
      driverId,
      status,
      date,
      fromLat,
      fromLong,
      toLat,
      toLong
    );
  }

  accept(driverId: string) {
    this.driverId = driverId;
    this.status.accept();
  }

  start() {
    this.status.start();
  }

  finish() {
    const fareCalculator = FareCalculatorFactory.create(this.date);
    this.fare = fareCalculator.calculate(this.distance);
    this.status.finish();
    this.notify(new RideCompletedEvent(this.rideId, this.fare));
  }

  updatePosition(position: Position) {
    if (this.lastPosition?.lat && this.lastPosition?.long) {
      this.distance += distanceBetweenPoints(this.lastPosition, position.coord);
    }
    this.lastPosition = position.coord;
  }

  getStatus() {
    return this.status.value;
  }

  getDriverId() {
    return this.driverId;
  }

  getFare() {
    return this.fare;
  }

  getDistance() {
    return Number(this.distance);
  }

  getLastPosition() {
    return this.lastPosition;
  }
}
