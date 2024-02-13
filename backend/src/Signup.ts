import crypto from "crypto";
import { Account, getConnection } from "./database";
import { CpfValidator } from "./CpfValidator";
import AccountDAO from "./AccountDAO";
import { AccountDAODatabase } from "./AccountDAODatabase";

interface SignupInput {
  name: string;
  email: string;
  cpf: string;
  carPlate?: string;
  isPassenger: boolean;
  isDriver?: boolean;
}

export class Signup {
  constructor(private readonly accountDao: AccountDAO) {}

  async execute(input: SignupInput) {
    const accountId = crypto.randomUUID();

    const account = await this.accountDao.getByEmail(input.email);
    if (account) throw new Error("Duplicated account");
    if (this.isInvalidName(input.name)) throw new Error("Invalid name");
    if (this.isInvalidEmail(input.email)) throw new Error("Invalid email");
    const cpfValidator = new CpfValidator(input.cpf);
    if (!cpfValidator.validate()) throw new Error("Invalid cpf");
    if (this.isInvalidCarPlate(input.carPlate))
      throw new Error("Invalid car plate");

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
  private isInvalidName(name: string) {
    return !name.match(/[a-zA-Z] [a-zA-Z]+/);
  }

  private isInvalidEmail(email: string) {
    return !email.match(/^(.+)@(.+)$/);
  }

  private isInvalidCarPlate(carPlate: any) {
    if (!carPlate) return false;
    return !carPlate.match(/[A-Z]{3}[0-9]{4}/);
  }
}
