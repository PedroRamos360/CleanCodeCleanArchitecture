import { AcceptRide } from "./application/usecase/AcceptRide";
import { FinishRide } from "./application/usecase/FinishRide";
import GetRide from "./application/usecase/GetRide";
import { RequestRide } from "./application/usecase/RequestRide";
import { StartRide } from "./application/usecase/StartRide";
import { UpdatePosition } from "./application/usecase/UpdatePosition";
import { getEnviormentVariable } from "./env/getEnvironmentVariable";
import { MainController } from "./infra/controller/MainController";
import { PgPromiseAdapter } from "./infra/database/PgPromiseAdapter";
import { ExpressAdapter } from "./infra/http/ExpressAdapter";
import { AccountRepositoryApi } from "./infra/repository/AccountRepositoryApi";
import { PositionRepositoryDatabase } from "./infra/repository/PositionRepositoryDatabase";
import { RideRepositoryDatabase } from "./infra/repository/RideRepositoryDatabase";
import dotenv from "dotenv";
dotenv.config();

// composition root ou entry point
// criar o grafo de dependências utilizado no projeto

// framework and driver and library
const httpServer = new ExpressAdapter();
const databaseConnection = new PgPromiseAdapter();

// interface adapter
const accountRepository = new AccountRepositoryApi();
const rideRepository = new RideRepositoryDatabase(databaseConnection);
const positionRepository = new PositionRepositoryDatabase(databaseConnection);

// use case
const requestRide = new RequestRide(rideRepository, accountRepository);
const getRide = new GetRide(rideRepository, accountRepository);
const acceptRide = new AcceptRide(rideRepository, accountRepository);
const finishRide = new FinishRide(rideRepository);
const startRide = new StartRide(rideRepository);
const updatePosition = new UpdatePosition(positionRepository, rideRepository);

// interface adapter
new MainController(
  httpServer,
  requestRide,
  getRide,
  acceptRide,
  finishRide,
  startRide,
  updatePosition
);
httpServer.listen(Number(getEnviormentVariable("RIDE_PORT")));
