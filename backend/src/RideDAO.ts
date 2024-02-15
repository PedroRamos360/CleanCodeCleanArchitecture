import { Ride } from "./database";

export interface SaveRide {
  rideId: string;
  passengerId: string;
  fromLat: number;
  fromLong: number;
  toLat: number;
  toLong: number;
  status: string;
  date: Date;
  distance: number;
  driverId?: string;
}

export default interface RideDAO {
  save(ride: SaveRide): Promise<void>;
  getById(rideId: string): Promise<Ride>;
  getByPassengerId(passengerId: string): Promise<Ride[]>;
  getRidesByDriverId(driverId: string): Promise<Ride[]>;
  update(ride: SaveRide): Promise<void>;
}
