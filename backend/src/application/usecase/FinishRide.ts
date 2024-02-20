import { Ride } from "../../domain/Ride";
import { distanceBetweenPoints } from "../../math/distanceBetweenPoints";
import { PositionRepository } from "../repository/PositionRepository";
import { RideRepository } from "../repository/RideRepository";

export class FinishRide {
  constructor(
    private rideRepository: RideRepository,
    private positionRepository: PositionRepository
  ) {}

  async execute(rideId: string): Promise<Ride> {
    const ride = await this.rideRepository.getById(rideId);
    if (!ride) throw new Error("Ride not found");
    if (ride.getStatus() !== "in_progress")
      throw new Error("Ride is not in progress");
    ride.finish();
    ride.distance = await this.getDistance(rideId);
    ride.fare = this.getFare(ride.distance);
    await this.rideRepository.update(ride);
    return ride;
  }

  private async getDistance(rideId: string) {
    const ridePositions = await this.positionRepository.listPositionsByRideId(
      rideId
    );
    if (ridePositions.length < 2) return 0;
    let distance = 0;
    for (let i = 0; i < ridePositions.length - 1; i++) {
      const start = ridePositions[i];
      const end = ridePositions[i + 1];
      const pointA = {
        lat: start.lat,
        long: start.long,
      };
      const pointB = {
        lat: end.lat,
        long: end.long,
      };
      distance += distanceBetweenPoints(pointA, pointB);
    }

    return distance;
  }

  private getFare(distance: number) {
    return distance * 1.5;
  }
}
