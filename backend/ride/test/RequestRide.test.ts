import GetRide from "../src/application/usecase/GetRide";
import { RequestRide } from "../src/application/usecase/RequestRide";
import { RideRepositoryDatabase } from "../src/infra/repository/RideRepositoryDatabase";
import { PgPromiseAdapter } from "../src/infra/database/PgPromiseAdapter";
import { AccountRepositoryApi } from "../src/infra/repository/AccountRepositoryApi";

let requestRide: RequestRide;
let getRide: GetRide;
let connection: PgPromiseAdapter;
let accountRepository: AccountRepositoryApi;

beforeEach(() => {
  connection = new PgPromiseAdapter();
  accountRepository = new AccountRepositoryApi();
  const rideRepository = new RideRepositoryDatabase(connection);
  requestRide = new RequestRide(rideRepository, accountRepository);
  getRide = new GetRide(rideRepository, accountRepository);
});

afterEach(async () => {
  await connection.close();
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
  const outputRequestRide = await requestRide.execute(inputRequestRide);
  expect(outputRequestRide.rideId).toBeDefined();
  const outputGetRide = await getRide.execute(outputRequestRide.rideId);
  expect(outputGetRide?.status).toBe("requested");
}, 20000);
