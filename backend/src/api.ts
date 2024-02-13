import assert from "assert";
import express, { Response } from "express";
import morgan from "morgan";
import AccountDAODatabase from "./AccountDAODatabase";
import { Signup } from "./Signup";
import RideDAODatabase from "./RideDAODatabase";

function routeTreatment(
  res: Response,
  functionToCall: CallableFunction,
  input: unknown,
  errorCode: number = 400
) {
  void functionToCall(input)
    .then((data: unknown) => {
      res.status(200).send(data);
    })
    .catch((error: Error) => {
      res.status(errorCode).send({ error: error.message });
    });
}

const PORT = 3000;
const app = express();
app.use(express.json());
app.use(morgan("dev"));
app.listen(PORT);
console.log(`Server started at localhost:${PORT}`);
app.get("/", (req, res) => res.send("Hello World!"));
app.post("/signup", (req, res) => {
  assert(req.body);
  const accountDao = new AccountDAODatabase();
  const signup = new Signup(accountDao);
  void routeTreatment(res, signup.execute, req.body, 422);
});
app.get("/account/:accountId", (req, res) => {
  assert(req.params);
  const accountDao = new AccountDAODatabase();
  void routeTreatment(res, accountDao.getById, req.params.accountId);
});
app.post("/request-ride", (req, res) => {
  assert(req.body);
  const rideDao = new RideDAODatabase();
  void routeTreatment(res, rideDao.save, req.body);
});
app.get("/ride/:rideId", (req, res) => {
  assert(req.params);
  const rideDao = new RideDAODatabase();
  void routeTreatment(res, rideDao.getById, req.params.rideId);
});
