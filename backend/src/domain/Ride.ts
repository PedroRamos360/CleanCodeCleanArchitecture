interface CreateRide {
  passengerId: string;
  fromLat: number;
  fromLong: number;
  toLat: number;
  toLong: number;
}

export class Ride {
  private constructor(
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
    this.status = "started";
  }

  getDistance() {
    const R = 6371;
    const φ1 = (this.fromLat * Math.PI) / 180;
    const φ2 = (this.toLat * Math.PI) / 180;
    const Δφ = ((this.toLat - this.fromLat) * Math.PI) / 180;
    const Δλ = ((this.toLong - this.fromLong) * Math.PI) / 180;
    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
  }

  getDriverId() {
    return this.driverId;
  }

  getStatus() {
    return this.status;
  }
}
