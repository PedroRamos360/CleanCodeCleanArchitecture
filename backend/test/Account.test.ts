import { Account } from "../src/domain/Account";

// sociable
test("Deve criar uma conta", function () {
  const account = Account.create({
    email: "john.doe@gmail.com",
    name: "John Doe",
    cpf: "97456321558",
    isPassenger: true,
    creditCardToken: "123456",
  });
  expect(account.accountId).toBeDefined();
  expect(account.name.value).toBe("John Doe");
  expect(account.email.value).toBe("john.doe@gmail.com");
  expect(account.cpf.value).toBe("97456321558");
});
