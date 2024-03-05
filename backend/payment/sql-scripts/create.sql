drop schema cccat14 cascade;

create schema cccat14;

create table cccat14.account (
	account_id uuid primary key,
	name text not null,
	email text not null,
	cpf text not null,
	car_plate text null,
	is_passenger boolean not null default false,
	is_driver boolean not null default false,
  credit_card_token text not null
);

create table cccat14.ride (
	ride_id uuid,
	passenger_id uuid,
	driver_id uuid,
	status text,
	fare numeric,
  distance numeric,
	from_lat numeric,
	from_long numeric,
	to_lat numeric,
	to_long numeric,
  last_lat numeric,
	last_long numeric,
	date timestamp
);

create table cccat14.position (
  position_id uuid,
  ride_id uuid,
  lat numeric,
  long numeric,
  date timestamp
);

create table cccat14.transaction (
  transaction_id uuid primary key,
  ride_id uuid,
  amount numeric,
  date timestamp,
  status text
);