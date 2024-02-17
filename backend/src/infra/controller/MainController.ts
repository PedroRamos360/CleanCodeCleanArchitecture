import { AcceptRide } from "../../application/usecase/AcceptRide";
import { GetAccount } from "../../application/usecase/GetAccount";
import GetRide from "../../application/usecase/GetRide";
import { RequestRide } from "../../application/usecase/RequestRide";
import { Signup } from "../../application/usecase/Signup";
import { HttpServer } from "../http/HttpServer";

// Interface Adapter
export class MainController {
  constructor(
    readonly httpServer: HttpServer,
    signup: Signup,
    getAccount: GetAccount,
    requestRide: RequestRide,
    getRide: GetRide,
    acceptRide: AcceptRide
  ) {
    httpServer.register(
      "post",
      "/signup",
      async function (params: any, body: any) {
        const output = await signup.execute(body);
        return output;
      }
    );
    httpServer.register(
      "get",
      "/accounts/:accountId",
      async function (params: any, body: any) {
        const output = await getAccount.execute(params.accountId);
        return output;
      }
    );
    httpServer.register(
      "post",
      "/request-ride",
      async function (params: any, body: any) {
        const output = await requestRide.execute(body);
        return output;
      }
    );
    httpServer.register(
      "get",
      "/rides/:rideId",
      async function (params: any, body: any) {
        const output = await getRide.execute(params.rideId);
        return output;
      }
    );
    httpServer.register(
      "post",
      "/accept-ride",
      async function (params: any, body: any) {
        const output = await acceptRide.execute(body.rideId, body.driverId);
        return output;
      }
    );
  }
}
