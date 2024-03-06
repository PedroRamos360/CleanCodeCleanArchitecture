import { GetAccount } from "../../application/usecase/GetAccount";
import { Signup } from "../../application/usecase/Signup";
import { HttpServer } from "../http/HttpServer";

// Interface Adapter
export class MainController {
  constructor(
    readonly httpServer: HttpServer,
    signup: Signup,
    getAccount: GetAccount
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
  }
}
