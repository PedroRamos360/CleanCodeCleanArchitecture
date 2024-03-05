import { Ride } from "../../domain/Ride";
import { RideRepository } from "../repository/RideRepository";

export class FinishRide {
  constructor(private rideRepository: RideRepository) {}

  async execute(rideId: string): Promise<Ride> {
    const ride = await this.rideRepository.getById(rideId);
    if (!ride) throw new Error("Ride not found");
    if (ride.getStatus() !== "in_progress")
      throw new Error("Ride is not in progress");
    ride.finish();
    await this.rideRepository.update(ride);
    return ride;
  }
}
