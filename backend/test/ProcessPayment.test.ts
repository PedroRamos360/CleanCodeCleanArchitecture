import { AccountRepository } from "../src/application/repository/AccountRepository";
import { PositionRepository } from "../src/application/repository/PositionRepository";
import { RideRepository } from "../src/application/repository/RideRepository";
import { TransactionRepository } from "../src/application/repository/TransactionRepository";
import { AcceptRide } from "../src/application/usecase/AcceptRide";
import { FinishRide } from "../src/application/usecase/FinishRide";
import { ProcessPayment } from "../src/application/usecase/ProcessPayment";
import { StartRide } from "../src/application/usecase/StartRide";
import { UpdatePosition } from "../src/application/usecase/UpdatePosition";
import { DatabaseConnection } from "../src/infra/database/DatabaseConnection";
import { PgPromiseAdapter } from "../src/infra/database/PgPromiseAdapter";
import { AccountRepositoryDatabase } from "../src/infra/repository/AccountRepositoryDatabase";
import { PositionRepositoryDatabase } from "../src/infra/repository/PositionRepositoryDatabase";
import { RideRepositoryDatabase } from "../src/infra/repository/RideRepositoryDatabase";
import TransactionRepositoryORM from "../src/infra/repository/TransactionRepositoryORM";
import { createRideAndRequestIt } from "./createRideAndRequestIt";

let connection: DatabaseConnection;
let positionRepository: PositionRepository;
let accountRepository: AccountRepository;
let rideRepository: RideRepository;
let transactionRepository: TransactionRepository;

let acceptRide: AcceptRide;
let updatePosition: UpdatePosition;
let finishRide: FinishRide;
let processPayment: ProcessPayment;

let driverId: string;
let rideId: string;

beforeEach(async () => {
  connection = new PgPromiseAdapter();
  positionRepository = new PositionRepositoryDatabase(connection);
  accountRepository = new AccountRepositoryDatabase(connection);
  rideRepository = new RideRepositoryDatabase(connection);
  transactionRepository = new TransactionRepositoryORM(connection);

  acceptRide = new AcceptRide(rideRepository, accountRepository);
  updatePosition = new UpdatePosition(positionRepository, rideRepository);
  finishRide = new FinishRide(rideRepository);
  processPayment = new ProcessPayment(transactionRepository, rideRepository);

  const { outputRequestRide, driverOutput } = await createRideAndRequestIt(
    connection
  );
  driverId = driverOutput.accountId;
  rideId = outputRequestRide.rideId;
  await acceptRide.execute(rideId, driverId);
  const startRide = new StartRide(rideRepository);
  await startRide.execute(rideId);
  await updatePosition.execute(
    rideId,
    -27.584905257808835,
    -48.545022195325124
  );
  await updatePosition.execute(
    rideId,
    -27.496887588317275,
    -48.522234807851476
  );
  await finishRide.execute(rideId);
});

afterEach(async () => {
  await connection.close();
});

test("Se o valor for menor que zero lançar erro", async () => {
  await expect(processPayment.execute(rideId, "", -10)).rejects.toThrow(
    "Invalid amount"
  );
});

test("Se a corrida não existir lançar erro", async () => {
  await expect(
    processPayment.execute("18152246-110e-4c5b-87fa-ff3ab60f2e98", "", 10)
  ).rejects.toThrow("Ride not found");
});

test("Deve salvar a transação", async () => {
  await processPayment.execute(rideId, "", 10);
  const transaction = await transactionRepository.getByRideId(rideId);
  expect(transaction).toBeDefined();
});
