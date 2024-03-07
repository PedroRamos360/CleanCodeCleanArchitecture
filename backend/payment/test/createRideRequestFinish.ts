import { AccountRepositoryApi } from "../src/infra/repository/AccountRepositoryApi";
import { RideRepositoryApi } from "../src/infra/repository/RideRepositoryApi";

export async function createRideRequestFinish() {
  const accountRepository = new AccountRepositoryApi();
  const rideRepository = new RideRepositoryApi();
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
  const passengerOutput = await accountRepository.signup(passengerSignup);
  const driverOutput = await accountRepository.signup(driverSignup);
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
  const outputRequestRide = await rideRepository.requestRide(inputRequestRide);
  await rideRepository.acceptRide(
    outputRequestRide.rideId,
    driverOutput.accountId
  );
  await rideRepository.startRide(outputRequestRide.rideId);
  await rideRepository.updatePosition(
    outputRequestRide.rideId,
    -27.584905257808835,
    -48.545022195325124
  );
  await rideRepository.updatePosition(
    outputRequestRide.rideId,
    -27.496887588317275,
    -48.522234807851476
  );
  await rideRepository.finishRide(outputRequestRide.rideId);

  return {
    passengerOutput,
    driverOutput,
    outputRequestRide,
  };
}
