import { AccountRepository } from "../repository/AccountRepository";
import { RideRepository } from "../repository/RideRepository";

export class AcceptRide {
  constructor(
    private rideRepository: RideRepository,
    private accountRepository: AccountRepository
  ) {}

  async execute(ride_id: string, driver_id: string) {
    const account = await this.accountRepository.getAccount(driver_id);
    const ride = await this.rideRepository.getById(ride_id);
    const driverRides = await this.rideRepository.getRidesByDriverId(driver_id);
    if (!ride) throw new Error("Ride not found");
    if (!account) throw new Error("Account not found");
    if (!account.isDriver) throw new Error("Account is not a driver");
    if (ride.getStatus() !== "requested")
      throw new Error("Ride is not requested");
    const driverAlreadyHasRide = driverRides.some(
      (ride) =>
        ride.getStatus() === "accepted" || ride.getStatus() === "in_progress"
    );
    if (driverAlreadyHasRide) throw new Error("Driver already has a ride");
    ride.accept(driver_id);

    await this.rideRepository.update(ride);
  }
}
