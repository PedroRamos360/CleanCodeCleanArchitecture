import { RideRepository } from "../repository/RideRepository";

export default class GetRideByPassengerId {
  constructor(private rideRepository: RideRepository) {}

  async execute(passengerId: string): Promise<Output> {
    const ride = await this.rideRepository.getActiveRideByPassengerId(
      passengerId
    );
    if (!ride) throw new Error("Ride not found");
    return {
      rideId: ride.rideId,
      status: ride.getStatus(),
      driverId: ride.getDriverId(),
      passengerId: ride.passengerId,
      distance: ride.getDistance(),
      fare: ride.getFare(),
    };
  }
}

type Output = {
  rideId: string;
  status: string;
  driverId: string;
  passengerId: string;
  distance?: number;
  fare?: number;
};
