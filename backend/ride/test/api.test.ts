import axios from "axios";
import { AccountRepository } from "../src/application/repository/AccountRepository";
import GetRideByPassengerId from "../src/application/usecase/GetRideByPassengerId";
import { RequestRide } from "../src/application/usecase/RequestRide";
import { DatabaseConnection } from "../src/infra/database/DatabaseConnection";
import { PgPromiseAdapter } from "../src/infra/database/PgPromiseAdapter";
import { AccountRepositoryApi } from "../src/infra/repository/AccountRepositoryApi";
import { RideRepositoryDatabase } from "../src/infra/repository/RideRepositoryDatabase";
import { getEnviormentVariable } from "../src/env/getEnvironmentVariable";

async function sleep(time: number) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(time);
    }, time);
  });
}

let requestRide: RequestRide;
let getRideByPassengerId: GetRideByPassengerId;
let databaseConnection: DatabaseConnection;
let accountRepository: AccountRepository;

beforeEach(() => {
  databaseConnection = new PgPromiseAdapter();
  const rideRepository = new RideRepositoryDatabase(databaseConnection);
  accountRepository = new AccountRepositoryApi();
  requestRide = new RequestRide(rideRepository, accountRepository);
  getRideByPassengerId = new GetRideByPassengerId(rideRepository);
});

test("Deve solicitar uma corrida", async function () {
  const inputSignup = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "97456321558",
    isPassenger: true,
    password: "123456",
  };
  const outputSignup = await accountRepository.signup(inputSignup);
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
  await axios.post(
    `http://localhost:${getEnviormentVariable("RIDE_PORT")}/request_ride_async`,
    inputRequestRide
  );
  await sleep(200);
  const outputGetRide = await getRideByPassengerId.execute(
    outputSignup.accountId
  );
  expect(outputGetRide.status).toBe("requested");
});

afterEach(async () => {
  await databaseConnection.close();
});
