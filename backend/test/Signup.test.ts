import AccountDAO from "../src/AccountDAO";
import { AccountDAODatabase } from "../src/AccountDAODatabase";
import { Signup } from "../src/Signup";
import sinon from "sinon";

let signup: Signup;
let accountDAO: AccountDAO;

beforeEach(() => {
  accountDAO = new AccountDAODatabase();
  signup = new Signup(accountDAO);
});

test("Deve criar uma conta para o passageiro com stub", async function () {
  const stubAccountDAOSave = sinon
    .stub(AccountDAODatabase.prototype, "save")
    .resolves();
  const stubAccountDAOGetByEmail = sinon
    .stub(AccountDAODatabase.prototype, "getByEmail")
    .resolves(null);
  const inputSignup = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "97456321558",
    isPassenger: true,
    password: "123456",
  };
  const outputSignup = await signup.execute(inputSignup);
  expect(outputSignup.accountId).toBeDefined();
  const stubAccountDAOGetById = sinon
    .stub(AccountDAODatabase.prototype, "getById")
    .resolves(inputSignup);
  const outputGetAccount = await accountDAO.getById(outputSignup.accountId);
  // then
  expect(outputGetAccount.name).toBe(inputSignup.name);
  expect(outputGetAccount.email).toBe(inputSignup.email);
  stubAccountDAOSave.restore();
  stubAccountDAOGetByEmail.restore();
  stubAccountDAOGetById.restore();
});

test("Deve criar uma conta para o passageiro com mock", async function () {
  const inputSignup = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "97456321558",
    isPassenger: true,
    password: "123456",
  };
  const outputSignup = await signup.execute(inputSignup);
  expect(outputSignup.accountId).toBeDefined();
  const outputGetAccount = await accountDAO.getById(outputSignup.accountId);
  // then
  expect(outputGetAccount.name).toBe(inputSignup.name);
  expect(outputGetAccount.email).toBe(inputSignup.email);
});

test("Não deve criar uma conta se o nome for inválido", async function () {
  // given
  const inputSignup = {
    name: "John",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "97456321558",
    isPassenger: true,
    password: "123456",
  };
  // when
  await expect(() => signup.execute(inputSignup)).rejects.toThrow(
    new Error("Invalid name")
  );
});

test("Não deve criar uma conta se o email for inválido", async function () {
  // given
  const inputSignup = {
    name: "John Doe",
    email: `john.doe${Math.random()}`,
    cpf: "97456321558",
    isPassenger: true,
    password: "123456",
  };
  // when
  await expect(() => signup.execute(inputSignup)).rejects.toThrow(
    new Error("Invalid email")
  );
});

test("Não deve criar uma conta se o cpf for inválido", async function () {
  // given
  const inputSignup = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "11111111111",
    isPassenger: true,
    password: "123456",
  };
  // when
  await expect(() => signup.execute(inputSignup)).rejects.toThrow(
    new Error("Invalid cpf")
  );
});

test("Não deve criar uma conta se o email for duplicado", async function () {
  // given
  const inputSignup = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "97456321558",
    isPassenger: true,
    password: "123456",
  };
  // when
  await signup.execute(inputSignup);
  await expect(() => signup.execute(inputSignup)).rejects.toThrow(
    new Error("Duplicated account")
  );
});

test("Deve criar uma conta para o motorista", async function () {
  // given
  const inputSignup = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "97456321558",
    carPlate: "AAA9999",
    isPassenger: false,
    isDriver: true,
    password: "123456",
  };
  // when
  const outputSignup = await signup.execute(inputSignup);
  const outputGetAccount = await accountDAO.getById(outputSignup.accountId);
  // then
  expect(outputSignup.accountId).toBeDefined();
  expect(outputGetAccount.name).toBe(inputSignup.name);
  expect(outputGetAccount.email).toBe(inputSignup.email);
});

test("Não deve criar uma conta para o motorista com a placa inválida", async function () {
  // given
  const inputSignup = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "97456321558",
    carPlate: "AAA999",
    isPassenger: false,
    isDriver: true,
    password: "123456",
  };
  // when
  await expect(() => signup.execute(inputSignup)).rejects.toThrow(
    new Error("Invalid car plate")
  );
});

test("Deve criar uma conta para o passageiro com fake", async function () {
  const inputSignup = {
    name: "John Doe",
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: "97456321558",
    isPassenger: true,
    password: "123456",
  };
  const accounts: any = [];
  const accountDAO: AccountDAO = {
    async save(account: any): Promise<void> {
      accounts.push(account);
    },
    async getById(accountId: string): Promise<any> {
      return accounts.find((account: any) => account.accountId === accountId);
    },
    async getByEmail(email: string): Promise<any> {
      return accounts.find((account: any) => account.email === email);
    },
  };
  const signup = new Signup(accountDAO);
  const outputSignup = await signup.execute(inputSignup);
  expect(outputSignup.accountId).toBeDefined();
  const outputGetAccount = await accountDAO.getById(outputSignup.accountId);
  // then
  expect(outputGetAccount.name).toBe(inputSignup.name);
  expect(outputGetAccount.email).toBe(inputSignup.email);
});
