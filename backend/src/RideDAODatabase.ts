import RideDAO, { SaveRide } from "./RideDAO";
import { Ride, getConnection } from "./database";

export default class RideDAODatabase implements RideDAO {
  async save(ride: SaveRide) {
    const connection = getConnection();
    await connection.query(
      "insert into cccat14.ride (ride_id, passenger_id, from_lat, from_long, to_lat, to_long, status, date, distance) values ($1, $2, $3, $4, $5, $6, $7, $8, $9)",
      [
        ride.rideId,
        ride.passengerId,
        ride.fromLat,
        ride.fromLong,
        ride.toLat,
        ride.toLong,
        ride.status,
        ride.date,
        ride.distance,
      ]
    );
    await connection.$pool.end();
  }

  async getById(rideId: string) {
    const connection = getConnection();
    const [ride] = await connection.query(
      "select * from cccat14.ride where ride_id = $1",
      [rideId]
    );
    await connection.$pool.end();
    return ride;
  }

  async getByPassengerId(passengerId: string): Promise<Ride[]> {
    const connection = getConnection();
    const rides = await connection.query(
      "select * from cccat14.ride where passenger_id = $1",
      [passengerId]
    );
    await connection.$pool.end();
    return rides;
  }
}
