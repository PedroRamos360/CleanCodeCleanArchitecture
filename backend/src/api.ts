import assert from "assert";
import express, { Response } from "express";
import morgan from "morgan";
import { AccountDAODatabase } from "./AccountDAODatabase";
import { Signup } from "./Signup";
import RideDAODatabase from "./RideDAODatabase";
import { AcceptRide } from "./AcceptRide";
import { StartRide } from "./StartRide";

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
      throw error;
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

  void routeTreatment(
    res,
    (input: any) => signup.execute(input),
    req.body,
    422
  );
});
app.get("/account/:accountId", (req, res) => {
  assert(req.params);
  const accountDao = new AccountDAODatabase();
  void routeTreatment(
    res,
    (input: any) => accountDao.getById(input),
    req.params.accountId
  );
});
app.post("/request-ride", (req, res) => {
  assert(req.body);
  const rideDao = new RideDAODatabase();
  void routeTreatment(res, (input: any) => rideDao.save(input), req.body);
});
app.get("/ride/:rideId", (req, res) => {
  assert(req.params);
  const rideDao = new RideDAODatabase();
  void routeTreatment(
    res,
    (input: any) => rideDao.getById(input),
    req.params.rideId
  );
});
app.post("/accept-ride", (req, res) => {
  assert(req.body);
  const rideDao = new RideDAODatabase();
  const accountDao = new AccountDAODatabase();
  const acceptRide = new AcceptRide(rideDao, accountDao);
  void routeTreatment(
    res,
    (input: any) => acceptRide.execute(input.rideId, input.driverId),
    req.body
  );
});
app.post("/start-ride", (req, res) => {
  assert(req.body);
  const rideDao = new RideDAODatabase();
  const startRide = new StartRide(rideDao);
  void routeTreatment(
    res,
    (input: any) => startRide.execute(input.rideId),
    req.body
  );
});
