import { RequestRide } from "../src/application/usecase/RequestRide";
import { Signup } from "../src/application/usecase/Signup";
import { DatabaseConnection } from "../src/infra/database/DatabaseConnection";
import { AccountRepositoryDatabase } from "../src/infra/repository/AccountRepositoryDatabase";
import { RideRepositoryDatabase } from "../src/infra/repository/RideRepositoryDatabase";

export async function createRideAndRequestIt(connection: DatabaseConnection) {
  const accountRepository = new AccountRepositoryDatabase(connection);
  const rideRepository = new RideRepositoryDatabase(connection);
  const signup = new Signup(accountRepository);
  const requestRide = new RequestRide(rideRepository, accountRepository);
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
  const passengerOutput = await signup.execute(passengerSignup);
  const driverOutput = await signup.execute(driverSignup);
  const inputRequestRide = {
    passengerId: passengerOutput.accountId,
    from: {
      lat: -29.7012128,
      lng: -53.7218208,
    },
    to: {
      lat: -29.7017541,
      lng: -53.7179348,
    },
  };
  const outputRequestRide = await requestRide.execute(inputRequestRide);
  return {
    passengerOutput,
    driverOutput,
    outputRequestRide,
  };
}
