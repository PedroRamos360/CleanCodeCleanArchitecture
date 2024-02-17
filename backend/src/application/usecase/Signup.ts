import crypto from "crypto";
import { AccountRepository } from "../repository/AccountRepository";
import { Account } from "../../domain/Account";

interface SignupInput {
  name: string;
  email: string;
  cpf: string;
  carPlate?: string;
  isPassenger: boolean;
  isDriver?: boolean;
}

export class Signup {
  constructor(private readonly accountRepository: AccountRepository) {}

  async execute(input: SignupInput) {
    const existingAccount = await this.accountRepository.getByEmail(
      input.email
    );
    if (existingAccount) throw new Error("Duplicated account");
    const account = Account.create({
      name: input.name,
      email: input.email,
      cpf: input.cpf,
      carPlate: input.carPlate,
      isPassenger: input.isPassenger,
      isDriver: input.isDriver,
    });
    await this.accountRepository.save(account);
    return {
      accountId: account.accountId,
    };
  }
}
