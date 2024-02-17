import { RideRepository } from "../../application/repository/RideRepository";
import { Ride } from "../../domain/Ride";
import { DatabaseConnection } from "../database/DatabaseConnection";

export class RideDAODatabase implements RideRepository {
  constructor(private connection: DatabaseConnection) {}

  async save(ride: Ride) {
    await this.connection.query(
      "insert into cccat14.ride (ride_id, passenger_id, from_lat, from_long, to_lat, to_long, status, date, distance) values ($1, $2, $3, $4, $5, $6, $7, $8, $9)",
      [
        ride.rideId,
        ride.passengerId,
        ride.fromLat,
        ride.fromLong,
        ride.toLat,
        ride.toLong,
        ride.getStatus(),
        ride.date,
        ride.getDistance(),
      ]
    );
    await this.connection.close();
  }

  async getById(rideId: string) {
    const [ride] = await this.connection.query(
      "select * from cccat14.ride where ride_id = $1",
      [rideId]
    );
    await this.connection.close();
    return ride;
  }

  async getByPassengerId(passengerId: string): Promise<Ride[]> {
    const rides = await this.connection.query(
      "select * from cccat14.ride where passenger_id = $1",
      [passengerId]
    );
    await this.connection.close();
    return rides;
  }

  async update(ride: Ride) {
    await this.connection.query(
      "update cccat14.ride set passenger_id = $2, from_lat = $3, from_long = $4, to_lat = $5, to_long = $6, status = $7, date = $8, distance = $9, driver_id = $10 where ride_id = $1",
      [
        ride.rideId,
        ride.passengerId,
        ride.fromLat,
        ride.fromLong,
        ride.toLat,
        ride.toLong,
        ride.getStatus(),
        ride.date,
        ride.getDistance(),
        ride.getDriverId(),
      ]
    );
    await this.connection.close();
  }

  async getRidesByDriverId(driverId: string): Promise<Ride[]> {
    const rides = await this.connection.query(
      "select * from cccat14.ride where driver_id = $1",
      [driverId]
    );
    await this.connection.close();
    return rides;
  }
}
