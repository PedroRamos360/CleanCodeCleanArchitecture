import crypto from "crypto";
import {
  Account,
  getConnection,
} from "../../infra/database/DatabaseConnection";
import { CpfValidator } from "../../domain/CpfValidator";
import { AccountRepository } from "../repository/AccountRepository";
import { AccountDAODatabase } from "../../infra/repository/AccountRepositoryDatabase";

interface SignupInput {
  name: string;
  email: string;
  cpf: string;
  carPlate?: string;
  isPassenger: boolean;
  isDriver?: boolean;
}

export class Signup {
  constructor(private readonly accountDao: AccountRepository) {}

  async execute(input: SignupInput) {
    const accountId = crypto.randomUUID();

    const account = await this.accountDao.getByEmail(input.email);
    if (account) throw new Error("Duplicated account");
    await this.accountDao.save({
      accountId,
      name: input.name,
      email: input.email,
      cpf: input.cpf,
      carPlate: input.carPlate,
      isPassenger: input.isPassenger,
      isDriver: input.isDriver,
    });
    return {
      accountId,
    };
  }
}
