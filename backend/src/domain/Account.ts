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
  carPlate?: string;
  isDriver?: boolean;
  isPassenger: boolean;
}

export class Account {
  accountId: string;
  name: Name;
  email: Email;
  cpf: Cpf;
  isPassenger: boolean;
  carPlate?: CarPlate;
  isDriver?: boolean;

  private constructor(
    accountId: string,
    name: Name,
    email: Email,
    cpf: Cpf,
    isPassenger: boolean,
    carPlate?: CarPlate,
    isDriver?: boolean
  ) {
    this.accountId = accountId;
    this.name = name;
    this.email = email;
    this.cpf = cpf;
    this.isPassenger = isPassenger;
    this.carPlate = carPlate;
    this.isDriver = isDriver;
  }

  static create({
    name,
    email,
    cpf,
    carPlate,
    isPassenger,
    isDriver,
  }: Omit<AccountProps, "accountId">) {
    const accountId = crypto.randomUUID();
    return new Account(
      accountId,
      new Name(name),
      new Email(email),
      new Cpf(cpf),
      isPassenger,
      carPlate ? new CarPlate(carPlate) : undefined,
      isDriver
    );
  }

  static restore({
    accountId,
    name,
    email,
    cpf,
    carPlate,
    isPassenger,
    isDriver,
  }: AccountProps) {
    return new Account(
      accountId,
      new Name(name),
      new Email(email),
      new Cpf(cpf),
      isPassenger,
      carPlate ? new CarPlate(carPlate) : undefined,
      isDriver
    );
  }
}
