import { Account } from "../../domain/Account";
import { AccountRepository } from "../../application/repository/AccountRepository";
import { DatabaseConnection } from "../database/DatabaseConnection";

export class AccountRepositoryDatabase implements AccountRepository {
  constructor(readonly connection: DatabaseConnection) {}

  async save(account: Account) {
    await this.connection.query(
      "insert into cccat14.account (account_id, name, email, cpf, car_plate, is_passenger, is_driver, credit_card_token) values ($1, $2, $3, $4, $5, $6, $7, $8)",
      [
        account.accountId,
        account.name.value,
        account.email.value,
        account.cpf.value,
        account.carPlate?.value,
        !!account.isPassenger,
        !!account.isDriver,
        account.creditCardToken,
      ]
    );
  }

  async getById(accountId: string): Promise<Account | undefined> {
    const [account] = await this.connection.query(
      "select * from cccat14.account where account_id = $1",
      [accountId]
    );
    if (!account) return undefined;
    return Account.restore({
      accountId: account.account_id,
      name: account.name,
      email: account.email,
      cpf: account.cpf,
      carPlate: account.car_plate,
      isPassenger: account.is_passenger,
      isDriver: account.is_driver,
      creditCardToken: account.credit_card_token,
    });
  }

  async getByEmail(email: string): Promise<Account | undefined> {
    const [account] = await this.connection.query(
      "select * from cccat14.account where email = $1",
      [email]
    );
    if (!account) return undefined;
    return Account.restore({
      accountId: account.account_id,
      name: account.name,
      email: account.email,
      cpf: account.cpf,
      carPlate: account.car_plate,
      isPassenger: account.is_passenger,
      isDriver: account.is_driver,
      creditCardToken: account.credit_card_token,
    });
  }
}
