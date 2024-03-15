import { RideRepository } from "../src/application/repository/RideRepository";
import { TransactionRepository } from "../src/application/repository/TransactionRepository";
import { ProcessPayment } from "../src/application/usecase/ProcessPayment";
import { DatabaseConnection } from "../src/infra/database/DatabaseConnection";
import { PgPromiseAdapter } from "../src/infra/database/PgPromiseAdapter";
import Queue from "../src/infra/queue/Queue";
import { RideRepositoryApi } from "../src/infra/repository/RideRepositoryApi";
import TransactionRepositoryORM from "../src/infra/repository/TransactionRepositoryORM";
import { createRideRequestFinish } from "./createRideRequestFinish";

let connection: DatabaseConnection;
let rideRepository: RideRepository;
let transactionRepository: TransactionRepository;

let processPayment: ProcessPayment;

let rideId: string;

beforeEach(async () => {
  connection = new PgPromiseAdapter();
  rideRepository = new RideRepositoryApi();
  transactionRepository = new TransactionRepositoryORM(connection);
  const queue = new Queue();

  processPayment = new ProcessPayment(
    transactionRepository,
    rideRepository,
    queue
  );

  const { outputRequestRide } = await createRideRequestFinish();
  rideId = outputRequestRide.rideId;
});

afterEach(async () => {
  await connection.close();
});

test("Se o valor for menor que zero lançar erro", async () => {
  const inputProcessPayment = {
    rideId,
    amount: -10,
  };
  await expect(processPayment.execute(inputProcessPayment)).rejects.toThrow(
    "Invalid amount"
  );
});

test("Se a corrida não existir lançar erro", async () => {
  const inputProcessPayment = {
    rideId: "18152246-110e-4c5b-87fa-ff3ab60f2e98",
    amount: 10,
  };
  await expect(processPayment.execute(inputProcessPayment)).rejects.toThrow(
    "Ride not found"
  );
});

test("Deve salvar a transação", async () => {
  const inputProcessPayment = {
    rideId,
    amount: 10,
  };
  await processPayment.execute(inputProcessPayment);
  const transaction = await transactionRepository.getByRideId(rideId);
  expect(transaction).toBeDefined();
});
