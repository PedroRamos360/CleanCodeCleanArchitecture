import { AcceptRide } from "../src/application/usecase/AcceptRide";
import { AccountRepositoryDatabase } from "../src/infra/repository/AccountRepositoryDatabase";
import GetRide from "../src/application/usecase/GetRide";
import { RequestRide } from "../src/application/usecase/RequestRide";
import { RideRepositoryDatabase } from "../src/infra/repository/RideRepositoryDatabase";
import { Signup } from "../src/application/usecase/Signup";
import { PgPromiseAdapter } from "../src/infra/database/PgPromiseAdapter";
import { DatabaseConnection } from "../src/infra/database/DatabaseConnection";

let signup: Signup;
let requestRide: RequestRide;
let getRide: GetRide;
let acceptRide: AcceptRide;

let passengerOutput: { accountId: string };
let driverOutput: { accountId: string };
let outputRequestRide: { rideId: string };

let connection: DatabaseConnection;

beforeEach(async () => {
  connection = new PgPromiseAdapter();
  const accountRepository = new AccountRepositoryDatabase(connection);
  const rideRepository = new RideRepositoryDatabase(connection);
  signup = new Signup(accountRepository);
  requestRide = new RequestRide(rideRepository, accountRepository);
  getRide = new GetRide(rideRepository, accountRepository);
  acceptRide = new AcceptRide(rideRepository, accountRepository);
  const passengerSignup = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "97456321558",
    isPassenger: true,
    password: "123456",
  };
  const driverSignup = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "97456321558",
    carPlate: "AAA9999",
    isPassenger: false,
    isDriver: true,
  };
  passengerOutput = await signup.execute(passengerSignup);
  driverOutput = await signup.execute(driverSignup);
  const inputRequestRide = {
    passengerId: passengerOutput.accountId,
    from: {
      lat: -27.584905257808835,
      lng: -48.545022195325124,
    },
    to: {
      lat: -27.496887588317275,
      lng: -48.522234807851476,
    },
  };
  outputRequestRide = await requestRide.execute(inputRequestRide);
});

afterEach(async () => {
  await connection.close();
});

test("Deve aceitar uma corrida", async function () {
  await acceptRide.execute(outputRequestRide.rideId, driverOutput.accountId);
  const ride = await getRide.byId(outputRequestRide.rideId);
  expect(ride).toBeDefined();
  expect(ride?.status).toBe("accepted");
  expect(ride?.driver?.accountId).toBe(driverOutput.accountId);
});

test("Deve lançar um erro porque a corrida já foi aceita", async function () {
  await acceptRide.execute(outputRequestRide.rideId, driverOutput.accountId);
  await expect(() =>
    acceptRide.execute(outputRequestRide.rideId, driverOutput.accountId)
  ).rejects.toThrow(new Error("Ride is not requested"));
});

test("Conta não existe", async function () {
  await expect(() =>
    acceptRide.execute(
      outputRequestRide.rideId,
      "631faacc-9ca0-476b-b2f4-ff11df679162"
    )
  ).rejects.toThrow(new Error("Account not found"));
});

test("Corrida não existe", async function () {
  await expect(() =>
    acceptRide.execute(
      "631faacc-9ca0-476b-b2f4-ff11df679162",
      driverOutput.accountId
    )
  ).rejects.toThrow(new Error("Ride not found"));
});

test("Conta não é motorista", async function () {
  await expect(() =>
    acceptRide.execute(outputRequestRide.rideId, passengerOutput.accountId)
  ).rejects.toThrow(new Error("Account is not a driver"));
});

test("Motorista já tem uma corrida", async function () {
  const passengerSignup = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "97456321558",
    isPassenger: true,
    password: "123456",
  };
  const outputSignup = await signup.execute(passengerSignup);
  const inputRequestRide = {
    passengerId: outputSignup.accountId,
    from: {
      lat: -27.584905257808835,
      lng: -48.545022195325124,
    },
    to: {
      lat: -27.496887588317275,
      lng: -48.522234807851476,
    },
  };
  const outputRequestRide2 = await requestRide.execute(inputRequestRide);
  await acceptRide.execute(outputRequestRide2.rideId, driverOutput.accountId);
  await expect(() =>
    acceptRide.execute(outputRequestRide.rideId, driverOutput.accountId)
  ).rejects.toThrow(new Error("Driver already has a ride"));
});
