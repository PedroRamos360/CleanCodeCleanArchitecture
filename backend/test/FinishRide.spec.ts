import { AccountRepository } from "../src/application/repository/AccountRepository";
import { PositionRepository } from "../src/application/repository/PositionRepository";
import { RideRepository } from "../src/application/repository/RideRepository";
import { AcceptRide } from "../src/application/usecase/AcceptRide";
import { StartRide } from "../src/application/usecase/StartRide";
import { UpdatePosition } from "../src/application/usecase/UpdatePosition";
import { DatabaseConnection } from "../src/infra/database/DatabaseConnection";
import { PgPromiseAdapter } from "../src/infra/database/PgPromiseAdapter";
import { AccountRepositoryDatabase } from "../src/infra/repository/AccountRepositoryDatabase";
import { PositionRepositoryDatabase } from "../src/infra/repository/PositionRepositoryDatabase";
import { RideRepositoryDatabase } from "../src/infra/repository/RideRepositoryDatabase";
import { createRideAndRequestIt } from "./createRideAndRequestIt";

let connection: DatabaseConnection;
let positionRepository: PositionRepository;
let accountRepository: AccountRepository;
let rideRepository: RideRepository;
let acceptRide: AcceptRide;
let updatePosition: UpdatePosition;

let driverId: string;
let rideId: string;

beforeEach(async () => {
  connection = new PgPromiseAdapter();
  positionRepository = new PositionRepositoryDatabase(connection);
  accountRepository = new AccountRepositoryDatabase(connection);
  rideRepository = new RideRepositoryDatabase(connection);
  acceptRide = new AcceptRide(rideRepository, accountRepository);
  updatePosition = new UpdatePosition(positionRepository, rideRepository);

  const { outputRequestRide, driverOutput } = await createRideAndRequestIt(
    connection
  );
  driverId = driverOutput.accountId;
  rideId = outputRequestRide.rideId;
  await acceptRide.execute(rideId, driverId);
});

afterEach(async () => {
  await connection.close();
});

test("Deve verificar se a corrida está em status 'in_progress', se não estiver lançar um erro", async () => {
  await expect(updatePosition.execute(rideId, 0, 0)).rejects.toThrow(
    "Ride is not in progress"
  );
});

test("Atualizar a corrida com o status 'completed', a distância e o valor da corrida (fare)", async () => {
  const startRide = new StartRide(rideRepository);
  await startRide.execute(rideId);
  const outputUpdatePosition = await updatePosition.execute(rideId, 0, 0);
  expect(outputUpdatePosition.positionId).toBeDefined();
});
