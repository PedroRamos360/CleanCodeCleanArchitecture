import dotenv from "dotenv";
import { ProcessPayment } from "./application/usecase/ProcessPayment";
import { MainController } from "./infra/controller/MainController";
import { PgPromiseAdapter } from "./infra/database/PgPromiseAdapter";
import { ExpressAdapter } from "./infra/http/ExpressAdapter";
import { RideRepositoryApi } from "./infra/repository/RideRepositoryApi";
import TransactionRepositoryORM from "./infra/repository/TransactionRepositoryORM";
import { getEnviormentVariable } from "./env/getEnvironmentVariable";
dotenv.config();

// composition root ou entry point
// criar o grafo de dependências utilizado no projeto

// framework and driver and library
const httpServer = new ExpressAdapter();
const databaseConnection = new PgPromiseAdapter();

// interface adapter
const transactionRepository = new TransactionRepositoryORM(databaseConnection);
const rideRepository = new RideRepositoryApi();

// use case
const processPayment = new ProcessPayment(
  transactionRepository,
  rideRepository
);

// interface adapter
new MainController(httpServer, processPayment);
httpServer.listen(Number(getEnviormentVariable("PAYMENT_PORT")));
