import axios from "axios";
import PaymentGateway from "../../application/gateway/PaymentGateway";
import { getEnviormentVariable } from "../../env/getEnvironmentVariable";

export default class PaymentGatewayHttp implements PaymentGateway {
  async processPayment(input: any): Promise<any> {
    await axios.post(
      `http://localhost:${getEnviormentVariable(
        "PAYMENT_PORT"
      )}/process_payment`,
      input
    );
  }
}
