import { AcceptRide } from "./application/usecase/AcceptRide";
import { GetAccount } from "./application/usecase/GetAccount";
import GetRide from "./application/usecase/GetRide";
import { RequestRide } from "./application/usecase/RequestRide";
import { Signup } from "./application/usecase/Signup";
import { MainController } from "./infra/controller/MainController";
import { PgPromiseAdapter } from "./infra/database/PgPromiseAdapter";
import { ExpressAdapter } from "./infra/http/ExpressAdapter";
import { AccountRepositoryDatabase } from "./infra/repository/AccountRepositoryDatabase";
import { RideRepositoryDatabase } from "./infra/repository/RideRepositoryDatabase";
import dotenv from "dotenv";
dotenv.config();

// composition root ou entry point
// criar o grafo de dependências utilizado no projeto

// framework and driver and library
const httpServer = new ExpressAdapter();
const databaseConnection = new PgPromiseAdapter();

// interface adapter
const accountRepository = new AccountRepositoryDatabase(databaseConnection);
const rideRepository = new RideRepositoryDatabase(databaseConnection);

// use case
const signup = new Signup(accountRepository);
const getAccount = new GetAccount(accountRepository);
const requestRide = new RequestRide(rideRepository, accountRepository);
const getRide = new GetRide(rideRepository, accountRepository);
const acceptRide = new AcceptRide(rideRepository, accountRepository);

// interface adapter
new MainController(
  httpServer,
  signup,
  getAccount,
  requestRide,
  getRide,
  acceptRide
);
httpServer.listen(3000);
