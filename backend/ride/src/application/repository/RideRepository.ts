import { Ride } from "../../domain/Ride";

export interface RideRepository {
  save(ride: Ride): Promise<void>;
  getById(rideId: string): Promise<Ride | undefined>;
  getByPassengerId(passengerId: string): Promise<Ride[]>;
  getRidesByDriverId(driverId: string): Promise<Ride[]>;
  getActiveRideByPassengerId(passengerId: string): Promise<Ride | undefined>;
  update(ride: Ride): Promise<void>;
}
