import { GetAccount } from "./application/usecase/GetAccount";
import { Signup } from "./application/usecase/Signup";
import { getEnviormentVariable } from "./env/getEnvironmentVariable";
import { MainController } from "./infra/controller/MainController";
import { PgPromiseAdapter } from "./infra/database/PgPromiseAdapter";
import { ExpressAdapter } from "./infra/http/ExpressAdapter";
import { AccountRepositoryDatabase } from "./infra/repository/AccountRepositoryDatabase";
import dotenv from "dotenv";
dotenv.config();

// composition root ou entry point
// criar o grafo de dependências utilizado no projeto

// framework and driver and library
const httpServer = new ExpressAdapter();
const databaseConnection = new PgPromiseAdapter();

// interface adapter
const accountRepository = new AccountRepositoryDatabase(databaseConnection);

// use case
const signup = new Signup(accountRepository);
const getAccount = new GetAccount(accountRepository);

// interface adapter
new MainController(httpServer, signup, getAccount);
httpServer.listen(Number(getEnviormentVariable("ACCOUNT_PORT")));
