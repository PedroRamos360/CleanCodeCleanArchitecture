import axios from "axios";
import { Account } from "../../../../account/src/domain/Account";
import { getEnviormentVariable } from "../../env/getEnvironmentVariable";
import { AccountRepository } from "../../application/repository/AccountRepository";

interface SignupInput {
  name: string;
  email: string;
  cpf: string;
  carPlate?: string;
  isPassenger: boolean;
  isDriver?: boolean;
}

export class AccountRepositoryApi implements AccountRepository {
  async signup(input: SignupInput): Promise<{ accountId: string }> {
    const output = await axios.post(`http://localhost:3001/signup`, input);
    return {
      accountId: output.data.accountId,
    };
  }

  async getAccount(accountId: string): Promise<Account | undefined> {
    const response = await axios.get(
      `http://localhost:3001/accounts/${accountId}`
    );
    return response.data;
  }
}
