import { Account } from "../../domain/Account";

export interface SignupInput {
  name: string;
  email: string;
  cpf: string;
  carPlate?: string;
  isPassenger: boolean;
  isDriver?: boolean;
}

export interface AccountRepository {
  signup(input: SignupInput): Promise<{ accountId: string }>;
  getAccount(accountId: string): Promise<Account | undefined>;
}
