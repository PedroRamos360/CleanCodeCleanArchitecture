import { AcceptRide } from "../src/application/usecase/AcceptRide";
import { AccountRepositoryDatabase } from "../src/infra/repository/AccountRepositoryDatabase";
import GetRide from "../src/application/usecase/GetRide";
import { RequestRide } from "../src/application/usecase/RequestRide";
import { RideRepositoryDatabase } from "../src/infra/repository/RideRepositoryDatabase";
import { Signup } from "../src/application/usecase/Signup";
import { StartRide } from "../src/application/usecase/StartRide";
import { PgPromiseAdapter } from "../src/infra/database/PgPromiseAdapter";

let signup: Signup;
let requestRide: RequestRide;
let getRide: GetRide;
let acceptRide: AcceptRide;
let startRide: StartRide;
let connection: PgPromiseAdapter;

let passengerOutput: { accountId: string };
let driverOutput: { accountId: string };
let outputRequestRide: { rideId: string };

beforeEach(async () => {
  connection = new PgPromiseAdapter();
  const accountDAO = new AccountRepositoryDatabase(connection);
  const rideDAO = new RideRepositoryDatabase(connection);
  signup = new Signup(accountDAO);
  requestRide = new RequestRide(rideDAO, accountDAO);
  getRide = new GetRide(rideDAO, accountDAO);
  acceptRide = new AcceptRide(rideDAO, accountDAO);
  startRide = new StartRide(rideDAO);

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

test("Deve começar a corrida", async function () {
  await acceptRide.execute(outputRequestRide.rideId, driverOutput.accountId);
  await startRide.execute(outputRequestRide.rideId);
  const ride = await getRide.byId(outputRequestRide.rideId);
  expect(ride?.status).toBe("in_progress");
});

test("Deve falhar ao começar uma corrida que não foi aceita", async function () {
  await expect(startRide.execute(outputRequestRide.rideId)).rejects.toThrow(
    "Ride is not accepted"
  );
});
