import { Ride } from "../../domain/Ride";
import { AccountRepository } from "../repository/AccountRepository";
import { RideRepository } from "../repository/RideRepository";

export interface RequestRideInput {
  passengerId: string;
  from: {
    lat: number;
    lng: number;
  };
  to: {
    lat: number;
    lng: number;
  };
}

export class RequestRide {
  constructor(
    private rideRepository: RideRepository,
    private accountRepository: AccountRepository
  ) {}

  async execute(input: RequestRideInput) {
    const account = await this.accountRepository.getAccount(input.passengerId);
    if (!account) throw new Error("Account not found");
    if (!account.isPassenger) throw new Error("Account is not a passenger");
    const passengerRides = await this.rideRepository.getByPassengerId(
      input.passengerId
    );
    const ongoingRide = passengerRides.find(
      (ride) => ride.getStatus() !== "completed"
    );
    if (ongoingRide) throw new Error("Account has an ongoing ride");
    const ride = Ride.create({
      passengerId: input.passengerId,
      fromLat: input.from.lat,
      fromLong: input.from.lng,
      toLat: input.to.lat,
      toLong: input.to.lng,
    });
    await this.rideRepository.save(ride);
    return {
      rideId: ride.rideId,
    };
  }

  calculateDistance(
    from: RequestRideInput["from"],
    to: RequestRideInput["to"]
  ): number {
    const R = 6371;
    const φ1 = (from.lat * Math.PI) / 180;
    const φ2 = (to.lat * Math.PI) / 180;
    const Δφ = ((to.lat - from.lat) * Math.PI) / 180;
    const Δλ = ((to.lng - from.lng) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c;
    return distance;
  }
}
