import { AccountRepository } from "../repository/AccountRepository";
import { RideRepository } from "../repository/RideRepository";
import { Account, Ride } from "../../infra/database/DatabaseConnection";

export interface GetRideOutput
  extends Omit<Ride, "passenger_id" | "driver_id"> {
  passenger: Account;
  driver?: Account;
}

export default class GetRide {
  constructor(
    private rideDao: RideRepository,
    private accountDao: AccountRepository
  ) {}

  async byId(rideId: string) {
    const ride = await this.rideDao.getById(rideId);
    const passengerDetails = await this.accountDao.getById(ride.passenger_id);
    const driverDetails = ride.driver_id
      ? await this.accountDao.getById(ride.driver_id)
      : null;

    return {
      ...ride,
      passenger: passengerDetails,
      driver: driverDetails,
      passenger_id: undefined,
      driver_id: undefined,
    };
  }
}
