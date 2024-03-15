import { Ride } from "../../domain/Ride";
import { DomainEvent } from "../../domain/event/DomainEvent";
import Queue from "../../infra/queue/Queue";
import { RideRepository } from "../repository/RideRepository";

export class FinishRide {
  constructor(private rideRepository: RideRepository, private queue: Queue) {}

  async execute(rideId: string): Promise<Ride> {
    const ride = await this.rideRepository.getById(rideId);
    if (!ride) throw new Error("Ride not found");
    ride.register(async (event: DomainEvent) => {
      await this.queue.publish(event.name, event);
    });
    if (ride.getStatus() !== "in_progress")
      throw new Error("Ride is not in progress");
    ride.finish();
    await this.rideRepository.update(ride);
    return ride;
  }
}
