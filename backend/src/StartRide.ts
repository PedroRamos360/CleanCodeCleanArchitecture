import RideDAO from "./RideDAO";

export class StartRide {
  constructor(private rideDao: RideDAO) {}

  async execute(ride_id: string) {
    const ride = await this.rideDao.getById(ride_id);
    if (!ride) throw new Error("Ride not found");
    if (ride.status !== "accepted") throw new Error("Ride is not accepted");
    ride.status = "in_progress";
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
      driverId: ride.driver_id,
    });
  }
}
