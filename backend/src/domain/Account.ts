import { CpfValidator } from "./CpfValidator";
import crypto from "crypto";

interface AccountProps {
  accountId: string;
  name: string;
  email: string;
  cpf: string;
  carPlate?: string;
  isPassenger: boolean;
  isDriver?: boolean;
}

export class Account {
  accountId: string;
  name: string;
  email: string;
  cpf: string;
  carPlate?: string;
  isPassenger: boolean;
  isDriver?: boolean;

  private constructor(input: AccountProps) {
    if (this.isInvalidName(input.name)) throw new Error("Invalid name");
    if (this.isInvalidEmail(input.email)) throw new Error("Invalid email");
    const cpfValidator = new CpfValidator(input.cpf);
    if (!cpfValidator.validate()) throw new Error("Invalid cpf");
    if (this.isInvalidCarPlate(input.carPlate))
      throw new Error("Invalid car plate");
    this.accountId = input.accountId;
    this.name = input.name;
    this.email = input.email;
    this.cpf = input.cpf;
    this.carPlate = input.carPlate;
    this.isPassenger = input.isPassenger;
    this.isDriver = input.isDriver;
  }

  static create(input: Omit<AccountProps, "accountId">) {
    const accountId = crypto.randomUUID();
    return new Account({
      ...input,
      accountId,
    });
  }

  static restore(input: AccountProps) {
    return new Account(input);
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
