import { Account } from "../src/database";
import { GetRideOutput, getRide, requestRide } from "../src/requestRide";
import { signup } from "../src/signup";

async function defaultSignup(isPassenger = true) {
  const inputSignup = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "667.302.550-64",
    isPassenger,
    password: "123456",
  };
  const { accountId } = await signup(inputSignup);
  return accountId;
}

test("Deve dar erro porque a conta não é passageiro", async () => {
  // given
  const accountId = await defaultSignup(false);
  const inputRequestRide = {
    passengerId: accountId,
    from: {
      lat: 0,
      lng: 0,
    },
    to: {
      lat: 0,
      lng: 0,
    },
  };
  // when
  await expect(() => requestRide(inputRequestRide)).rejects.toThrow(
    new Error("Account is not a passenger")
  );
});

test("Deve dar erro porque passageiro tem corrida com status diferente de completed", async () => {
  // given
  const accountId = await defaultSignup();
  const inputRequestRide = {
    passengerId: accountId,
    from: {
      lat: 0,
      lng: 0,
    },
    to: {
      lat: 0,
      lng: 0,
    },
  };
  // when
  await requestRide(inputRequestRide);
  // then
  await expect(() => requestRide(inputRequestRide)).rejects.toThrow(
    new Error("Account has an ongoing ride")
  );
});

test("Deve retornar o id da corrida", async function () {
  // given
  const accountId = await defaultSignup();
  const inputRequestRide = {
    passengerId: accountId,
    from: {
      lat: 0,
      lng: 0,
    },
    to: {
      lat: 0,
      lng: 0,
    },
  };
  // when
  const outputRequestRide = await requestRide(inputRequestRide);
  // then
  expect(outputRequestRide.rideId).toBeDefined();
});

test("Deve definir o status da corrida como requested", async function () {
  // given
  const accountId = await defaultSignup();
  const inputRequestRide = {
    passengerId: accountId,
    from: {
      lat: 0,
      lng: 0,
    },
    to: {
      lat: 0,
      lng: 0,
    },
  };
  // when
  const outputRequestRide = await requestRide(inputRequestRide);
  const ride = await getRide(outputRequestRide.rideId);
  // then
  expect(ride.status).toBe("requested");
});

test("Deve definir date como a data atual", async function () {
  // given
  const accountId = await defaultSignup();
  const inputRequestRide = {
    passengerId: accountId,
    from: {
      lat: 0,
      lng: 0,
    },
    to: {
      lat: 0,
      lng: 0,
    },
  };
  // when
  const outputRequestRide = await requestRide(inputRequestRide);
  const ride = await getRide(outputRequestRide.rideId);
  // then
  const now = new Date();
  const errorMarginMs = 60_000;
  const difference = Math.abs(now.getTime() - ride.date.getTime());
  expect(difference).toBeLessThan(errorMarginMs);
});

test("Deve retornar os dados do passageiro e motorista em GetRide", async function () {
  // given
  const accountId = await defaultSignup();
  const inputRequestRide = {
    passengerId: accountId,
    from: {
      lat: 0,
      lng: 0,
    },
    to: {
      lat: 0,
      lng: 0,
    },
  };
  // when
  const outputRequestRide = await requestRide(inputRequestRide);
  const ride = await getRide(outputRequestRide.rideId);
  // then
  expect(ride).toEqual(
    expect.objectContaining<GetRideOutput>({
      ride_id: outputRequestRide.rideId,
      passenger: expect.objectContaining<Account>({
        account_id: accountId,
        name: "John Doe",
        email: ride.passenger.email,
        cpf: "667.302.550-64",
        car_plate: null,
        is_passenger: true,
        is_driver: false,
      }),
      driver: undefined,
      status: ride.status,
      fare: ride.fare,
      distance: ride.distance,
      from_lat: ride.from_lat,
      from_long: ride.from_long,
      to_lat: ride.to_lat,
      to_long: ride.to_long,
      date: ride.date,
    })
  );
});
