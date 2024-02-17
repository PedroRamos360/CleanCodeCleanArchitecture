import { Position } from "../../domain/Position";
import { PositionRepository } from "../repository/PositionRepository";
import { RideRepository } from "../repository/RideRepository";

export class UpdatePosition {
  constructor(
    private positionRepository: PositionRepository,
    private rideRepository: RideRepository
  ) {}

  async execute(rideId: string, lat: number, long: number) {
    const position = new Position(rideId, lat, long);
    const ride = await this.rideRepository.getById(rideId);
    if (!ride) throw new Error("Ride not found");
    if (ride.getStatus() !== "in_progress")
      throw new Error("Ride is not in progress");
    return await this.positionRepository.save(position);
  }
}
