import { ProcessPayment } from "../../application/usecase/ProcessPayment";
import { HttpServer } from "../http/HttpServer";

// Interface Adapter
export class MainController {
  constructor(readonly httpServer: HttpServer, processPayment: ProcessPayment) {
    httpServer.register(
      "post",
      "/signup",
      async function (params: any, body: any) {
        const output = await processPayment.execute(body);
        return output;
      }
    );
  }
}
