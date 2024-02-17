import { AccountRepository } from "../repository/AccountRepository";
import { RideRepository } from "../repository/RideRepository";

export class AcceptRide {
  constructor(
    private rideDao: RideRepository,
    private accountDao: AccountRepository
  ) {}

  async execute(ride_id: string, driver_id: string) {
    const account = await this.accountDao.getById(driver_id);
    const ride = await this.rideDao.getById(ride_id);
    const driverRides = await this.rideDao.getRidesByDriverId(driver_id);
    if (!ride) throw new Error("Ride not found");
    if (!account) throw new Error("Account not found");
    if (!account.is_driver) throw new Error("Account is not a driver");
    if (ride.status !== "requested") throw new Error("Ride is not requested");
    const driverAlreadyHasRide = driverRides.some(
      (ride) => ride.status === "accepted" || ride.status === "in_progress"
    );
    if (driverAlreadyHasRide) throw new Error("Driver already has a ride");
    ride.status = "accepted";
    await this.rideDao.update({
      rideId: ride.ride_id,
      passengerId: ride.passenger_id,
      fromLat: ride.from_lat,
      fromLong: ride.from_long,
      toLat: ride.to_lat,
      toLong: ride.to_long,
      status: ride.status,
      date: ride.date,
      distance: ride.distance,
      driverId: driver_id,
    });
  }
}
