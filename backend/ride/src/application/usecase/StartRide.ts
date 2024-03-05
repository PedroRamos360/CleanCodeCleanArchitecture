import { RideRepository } from "../repository/RideRepository";

export class StartRide {
  constructor(private rideDao: RideRepository) {}

  async execute(ride_id: string) {
    const ride = await this.rideDao.getById(ride_id);
    if (!ride) throw new Error("Ride not found");
    if (ride.getStatus() !== "accepted") throw new Error("Ride is not accepted");
    ride.start();
    await this.rideDao.update(ride);
  }
}
