import express, { Request, Response } from "express";
import { getAccount, signup } from "./signup";
import { getRide, requestRide } from "./requestRide";
import assert from "assert";
import morgan from "morgan";

function routeTreatment(
  res: Response,
  functionToCall: CallableFunction,
  input: unknown
) {
  void functionToCall(input)
    .then((data: unknown) => {
      res.status(200).send(data);
    })
    .catch((error: Error) => {
      res.status(400).send({ error: error.message });
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
  void routeTreatment(res, signup, req.body);
});
app.get("/account/:accountId", (req, res) => {
  assert(req.params);
  void routeTreatment(res, getAccount, req.params.accountId);
});
app.post("/request-ride", (req, res) => {
  assert(req.body);
  void routeTreatment(res, requestRide, req.body);
});
app.get("/ride/:rideId", (req, res) => {
  assert(req.params);
  void routeTreatment(res, getRide, req.params.rideId);
});
