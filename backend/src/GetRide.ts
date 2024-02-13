import AccountDAO from "./AccountDAO";
import RideDAO from "./RideDAO";
import { Account, Ride } from "./database";

export interface GetRideOutput
  extends Omit<Ride, "passenger_id" | "driver_id"> {
  passenger: Account;
  driver?: Account;
}

export default class GetRide {
  constructor(private rideDao: RideDAO, private accountDao: AccountDAO) {}

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
