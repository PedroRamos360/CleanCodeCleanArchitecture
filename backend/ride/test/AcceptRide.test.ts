import sinon from "sinon";

sinon.stub(process, "env").value({
  PORT: 3002,
  ACCOUNT_PORT: 3001,
});

import { AcceptRide } from "../src/application/usecase/AcceptRide";
import GetRide from "../src/application/usecase/GetRide";
import { RequestRide } from "../src/application/usecase/RequestRide";
import { RideRepositoryDatabase } from "../src/infra/repository/RideRepositoryDatabase";
import { PgPromiseAdapter } from "../src/infra/database/PgPromiseAdapter";
import { DatabaseConnection } from "../src/infra/database/DatabaseConnection";
import { createRideAndRequestIt } from "./createRideAndRequestIt";
import { AccountRepositoryApi } from "../src/infra/repository/AccountRepositoryApi";

let requestRide: RequestRide;
let getRide: GetRide;
let acceptRide: AcceptRide;

let passengerOutput: { accountId: string };
let driverOutput: { accountId: string };
let outputRequestRide: { rideId: string };

let connection: DatabaseConnection;

let accountRepository: AccountRepositoryApi;

beforeEach(async () => {
  connection = new PgPromiseAdapter();
  accountRepository = new AccountRepositoryApi();
  const rideRepository = new RideRepositoryDatabase(connection);
  requestRide = new RequestRide(rideRepository, accountRepository);
  getRide = new GetRide(rideRepository, accountRepository);
  acceptRide = new AcceptRide(rideRepository, accountRepository);
  const output = await createRideAndRequestIt(connection);
  outputRequestRide = output.outputRequestRide;
  passengerOutput = output.passengerOutput;
  driverOutput = output.driverOutput;
});

afterEach(async () => {
  await connection.close();
});

test("Deve aceitar uma corrida", async function () {
  await acceptRide.execute(outputRequestRide.rideId, driverOutput.accountId);
  const ride = await getRide.execute(outputRequestRide.rideId);
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
  const outputSignup = await accountRepository.signup(passengerSignup);
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
