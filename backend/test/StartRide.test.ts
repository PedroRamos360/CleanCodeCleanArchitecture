import { AcceptRide } from "../src/AcceptRide";
import { AccountDAODatabase } from "../src/AccountDAODatabase";
import GetRide from "../src/GetRide";
import { RequestRide } from "../src/RequestRide";
import RideDAODatabase from "../src/RideDAODatabase";
import { Signup } from "../src/Signup";
import { StartRide } from "../src/StartRide";

let signup: Signup;
let requestRide: RequestRide;
let getRide: GetRide;
let acceptRide: AcceptRide;
let startRide: StartRide;

let passengerOutput: { accountId: string };
let driverOutput: { accountId: string };
let outputRequestRide: { rideId: string };

beforeEach(async () => {
  const accountDAO = new AccountDAODatabase();
  const rideDAO = new RideDAODatabase();
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

test("Deve começar a corrida", async function () {
  await acceptRide.execute(outputRequestRide.rideId, driverOutput.accountId);
  await startRide.execute(outputRequestRide.rideId);
  const ride = await getRide.byId(outputRequestRide.rideId);
  expect(ride.status).toBe("in_progress");
});

test("Deve falhar ao começar uma corrida que não foi aceita", async function () {
  await expect(startRide.execute(outputRequestRide.rideId)).rejects.toThrow(
    "Ride is not accepted"
  );
});
