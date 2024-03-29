import { RideRepository } from "../../application/repository/RideRepository";
import { Coord } from "../../domain/Coord";
import { Ride } from "../../domain/Ride";
import { DatabaseConnection } from "../database/DatabaseConnection";

interface RideDb {
  ride_id: string;
  passenger_id: string;
  driver_id: string;
  from_lat: number;
  from_long: number;
  to_lat: number;
  to_long: number;
  last_lat: number;
  last_long: number;
  fare: number;
  distance: number;
  status: string;
  date: Date;
}

function fromRideDbToRide(ride: RideDb): Ride {
  return new Ride(
    ride.ride_id,
    ride.passenger_id,
    ride.driver_id,
    ride.status,
    ride.date,
    ride.from_lat,
    ride.from_long,
    ride.to_lat,
    ride.to_long,
    new Coord(ride.last_lat, ride.last_long),
    ride.fare,
    ride.distance
  );
}

function fromRidesDbToRides(rides: RideDb[]): Ride[] {
  const rideInstances = rides.map((ride) => {
    return fromRideDbToRide(ride);
  });
  return rideInstances;
}

export class RideRepositoryDatabase implements RideRepository {
  constructor(private connection: DatabaseConnection) {}

  async save(ride: Ride) {
    await this.connection.query(
      "insert into cccat14.ride (ride_id, passenger_id, from_lat, from_long, to_lat, to_long, status, date) values ($1, $2, $3, $4, $5, $6, $7, $8)",
      [
        ride.rideId,
        ride.passengerId,
        ride.fromLat,
        ride.fromLong,
        ride.toLat,
        ride.toLong,
        ride.getStatus(),
        ride.date,
      ]
    );
  }

  async getById(rideId: string) {
    const [ride] = await this.connection.query(
      "select * from cccat14.ride where ride_id = $1",
      [rideId]
    );
    if (!ride) return undefined;

    return fromRideDbToRide(ride);
  }

  async getByPassengerId(passengerId: string): Promise<Ride[]> {
    const rides = await this.connection.query(
      "select * from cccat14.ride where passenger_id = $1",
      [passengerId]
    );

    return fromRidesDbToRides(rides);
  }

  async update(ride: Ride) {
    await this.connection.query(
      "update cccat14.ride set passenger_id = $2, from_lat = $3, from_long = $4, to_lat = $5, to_long = $6, status = $7, date = $8, driver_id = $9, distance = $10, fare = $11, last_lat = $12, last_long = $13 where ride_id = $1",
      [
        ride.rideId,
        ride.passengerId,
        ride.fromLat,
        ride.fromLong,
        ride.toLat,
        ride.toLong,
        ride.getStatus(),
        ride.date,
        ride.getDriverId(),
        ride.getDistance(),
        ride.getFare(),
        ride.getLastPosition()?.lat,
        ride.getLastPosition()?.long,
      ]
    );
  }

  async getActiveRideByPassengerId(
    passengerId: string
  ): Promise<Ride | undefined> {
    const [ride] = await this.connection.query(
      "select * from cccat14.ride where passenger_id = $1 and status in ('requested', 'accepted', 'in_progress')",
      [passengerId]
    );
    if (!ride) return;
    return new Ride(
      ride.ride_id,
      ride.passenger_id,
      ride.driver_id,
      ride.status,
      ride.date,
      parseFloat(ride.from_lat),
      parseFloat(ride.from_long),
      parseFloat(ride.to_lat),
      parseFloat(ride.to_long)
    );
  }

  async getRidesByDriverId(driverId: string): Promise<Ride[]> {
    const rides = await this.connection.query(
      "select * from cccat14.ride where driver_id = $1",
      [driverId]
    );

    return fromRidesDbToRides(rides);
  }
}
