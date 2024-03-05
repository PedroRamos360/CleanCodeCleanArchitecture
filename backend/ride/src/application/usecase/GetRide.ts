import { Account } from "../../../../account/src/domain/Account";
import { Ride } from "../../domain/Ride";
import { AccountRepository } from "../repository/AccountRepository";
import { RideRepository } from "../repository/RideRepository";

export interface GetRideOutput
  extends Omit<Ride, "passenger_id" | "driver_id"> {
  passenger: Account;
  driver?: Account;
}

export default class GetRide {
  constructor(
    private rideRepository: RideRepository,
    private accountRepository: AccountRepository
  ) {}

  async execute(rideId: string) {
    const ride = await this.rideRepository.getById(rideId);
    if (!ride) return undefined;
    const passengerDetails = await this.accountRepository.getAccount(
      ride.passengerId
    );
    const driverDetails = ride.getDriverId()
      ? await this.accountRepository.getAccount(ride.getDriverId())
      : null;

    return {
      ...ride,
      passenger: passengerDetails,
      driver: driverDetails,
      passenger_id: undefined,
      driver_id: undefined,
      status: ride.getStatus(),
    };
  }
}
