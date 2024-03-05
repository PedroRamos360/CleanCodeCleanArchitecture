import { AcceptRide } from "../../application/usecase/AcceptRide";
import GetRide from "../../application/usecase/GetRide";
import { RequestRide } from "../../application/usecase/RequestRide";
import { HttpServer } from "../http/HttpServer";

// Interface Adapter
export class MainController {
  constructor(
    readonly httpServer: HttpServer,
    requestRide: RequestRide,
    getRide: GetRide,
    acceptRide: AcceptRide
  ) {
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
