import pgp from "pg-promise";

export interface Account {
  account_id: string;
  name: string;
  email: string;
  cpf: string;
  car_plate: string | null;
  is_passenger: boolean;
  is_driver: boolean;
}

export interface Ride {
  ride_id: string;
  passenger_id: string;
  driver_id: string;
  status: string;
  fare: number;
  distance: number;
  from_lat: number;
  from_long: number;
  to_lat: number;
  to_long: number;
  date: Date;
}

export function getConnection() {
  const connection = pgp()("postgres://postgres:mypgdbpass@localhost:5432");
  return connection;
}
