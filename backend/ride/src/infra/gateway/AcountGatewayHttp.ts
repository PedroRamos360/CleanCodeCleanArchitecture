import axios from "axios";
import AccountGateway from "../../application/gateway/AccountGateway";
import { getEnviormentVariable } from "../../env/getEnvironmentVariable";

axios.defaults.validateStatus = function () {
  return true;
};

export class AccountGatewayHttp implements AccountGateway {
  async signup(input: any): Promise<any> {
    const response = await axios.post(
      `http://localhost:${getEnviormentVariable("ACCOUNT_PORT")}/signup`,
      input
    );
    return response.data;
  }

  async getById(accountId: string): Promise<any> {
    const response = await axios.get(
      `http://localhost:${getEnviormentVariable(
        "ACCOUNT_PORT"
      )}/accounts/${accountId}`
    );
    if (response.status === 422) {
      throw new Error(response.data.message);
    }
    return response.data;
  }
}
