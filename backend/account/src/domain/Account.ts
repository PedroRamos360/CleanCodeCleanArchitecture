import crypto from "crypto";
import { Name } from "./Name";
import { Email } from "./Email";
import { Cpf } from "./Cpf";
import { CarPlate } from "./CarPlate";

interface AccountProps {
  accountId: string;
  name: string;
  email: string;
  cpf: string;
  isPassenger: boolean;
  creditCardToken: string;
  carPlate?: string;
  isDriver?: boolean;
}

interface Constructor {
  accountId: string;
  name: Name;
  email: Email;
  cpf: Cpf;
  isPassenger: boolean;
  creditCardToken: string;
  carPlate?: CarPlate;
  isDriver?: boolean;
}

export class Account {
  accountId: string;
  name: Name;
  email: Email;
  cpf: Cpf;
  isPassenger: boolean;
  creditCardToken: string;
  carPlate?: CarPlate;
  isDriver?: boolean;

  private constructor({
    accountId,
    name,
    email,
    cpf,
    isPassenger,
    carPlate,
    isDriver,
    creditCardToken,
  }: Constructor) {
    this.accountId = accountId;
    this.name = name;
    this.email = email;
    this.cpf = cpf;
    this.isPassenger = isPassenger;
    this.carPlate = carPlate;
    this.isDriver = isDriver;
    this.creditCardToken = creditCardToken;
  }

  static create({
    name,
    email,
    cpf,
    carPlate,
    isPassenger,
    isDriver,
    creditCardToken,
  }: Omit<AccountProps, "accountId">) {
    const accountId = crypto.randomUUID();
    return new Account({
      accountId,
      name: new Name(name),
      email: new Email(email),
      cpf: new Cpf(cpf),
      isPassenger,
      carPlate: carPlate ? new CarPlate(carPlate) : undefined,
      isDriver,
      creditCardToken,
    });
  }

  static restore({
    accountId,
    name,
    email,
    cpf,
    carPlate,
    isPassenger,
    isDriver,
    creditCardToken,
  }: AccountProps) {
    return new Account({
      accountId,
      name: new Name(name),
      email: new Email(email),
      cpf: new Cpf(cpf),
      isPassenger,
      carPlate: carPlate ? new CarPlate(carPlate) : undefined,
      isDriver,
      creditCardToken,
    });
  }
}
