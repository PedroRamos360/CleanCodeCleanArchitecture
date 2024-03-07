import { AcceptRide } from "../../application/usecase/AcceptRide";
import { FinishRide } from "../../application/usecase/FinishRide";
import GetRide from "../../application/usecase/GetRide";
import { RequestRide } from "../../application/usecase/RequestRide";
import { StartRide } from "../../application/usecase/StartRide";
import { UpdatePosition } from "../../application/usecase/UpdatePosition";
import { HttpServer } from "../http/HttpServer";

// Interface Adapter
export class MainController {
  constructor(
    readonly httpServer: HttpServer,
    requestRide: RequestRide,
    getRide: GetRide,
    acceptRide: AcceptRide,
    finishRide: FinishRide,
    startRide: StartRide,
    updatePosition: UpdatePosition
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
    httpServer.register(
      "post",
      "/finish-ride",
      async function (params: any, body: any) {
        await finishRide.execute(body.rideId);
      }
    );
    httpServer.register(
      "post",
      "/start-ride",
      async function (params: any, body: any) {
        const output = await startRide.execute(body.rideId);
        return output;
      }
    );
    httpServer.register(
      "post",
      "/update-position",
      async function (params: any, body: any) {
        const output = await updatePosition.execute(
          body.rideId,
          body.lat,
          body.long
        );
        return output;
      }
    );
  }
}
