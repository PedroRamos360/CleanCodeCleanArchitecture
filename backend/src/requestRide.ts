import crypto from "crypto";
import { Account, Ride, getConnection } from "./database";
import { getAccount } from "./signup";

interface RequestRideInput {
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

function calculateDistance(
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

async function getRidesByPassengerId(passengerId: string): Promise<Ride[]> {
  const connection = getConnection();
  const rides = await connection.query(
    "select * from cccat14.ride where passenger_id = $1",
    [passengerId]
  );
  await connection.$pool.end();
  return rides;
}

export async function requestRide(input: RequestRideInput) {
  const account = await getAccount(input.passengerId);
  if (!account) throw new Error("Account not found");
  if (!account.is_passenger) throw new Error("Account is not a passenger");
  const passengerRides = await getRidesByPassengerId(input.passengerId);
  const ongoingRide = passengerRides.find(
    (ride) => ride.status !== "completed"
  );
  if (ongoingRide) throw new Error("Account has an ongoing ride");
  const connection = getConnection();
  const rideId = crypto.randomUUID();
  await connection.query(
    "insert into cccat14.ride (ride_id, passenger_id, from_lat, from_long, to_lat, to_long, status, date, distance) values ($1, $2, $3, $4, $5, $6, $7, $8, $9)",
    [
      rideId,
      input.passengerId,
      input.from.lat,
      input.from.lng,
      input.to.lat,
      input.to.lng,
      "requested",
      new Date(),
      calculateDistance(input.from, input.to),
    ]
  );
  await connection.$pool.end();
  return {
    rideId,
  };
}

export interface GetRideOutput
  extends Omit<Ride, "passenger_id" | "driver_id"> {
  passenger: Account;
  driver?: Account;
}

export async function getRide(rideId: string): Promise<GetRideOutput> {
  const connection = getConnection();
  const [ride] = await connection.query(
    "select * from cccat14.ride where ride_id = $1",
    [rideId]
  );
  await connection.$pool.end();
  const passengerDetails = await getAccount(ride.passenger_id);
  const driverDetails = ride.driver_id
    ? await getAccount(ride.driver_id)
    : null;

  delete ride["passenger_id"];
  delete ride["driver_id"];
  return {
    ...ride,
    passenger: passengerDetails,
    driver: driverDetails,
  };
}
