import AccountDAODatabase from "../src/AccountDAODatabase";
import GetRide from "../src/GetRide";
import { RequestRide } from "../src/RequestRide";
import RideDAODatabase from "../src/RideDAODatabase";
import { Signup } from "../src/Signup";

let signup: Signup;
let requestRide: RequestRide;
let getRide: GetRide;

beforeEach(() => {
  const accountDAO = new AccountDAODatabase();
  const rideDAO = new RideDAODatabase();
  signup = new Signup(accountDAO);
  requestRide = new RequestRide(rideDAO, accountDAO);
  getRide = new GetRide(rideDAO, accountDAO);
});

test("Deve solicitar uma corrida", async function () {
  const inputSignup = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "97456321558",
    isPassenger: true,
    password: "123456",
  };
  const outputSignup = await signup.execute(inputSignup);
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

  const outputGetRide = await getRide.byId(outputRequestRide.rideId);
});
