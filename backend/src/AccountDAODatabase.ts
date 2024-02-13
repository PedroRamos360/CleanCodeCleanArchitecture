import AccountDAO from "./AccountDAO";
import GetAccountAccountDAO from "./GetAccountDAO";
import SignupAccountDAO from "./SignupAccountDAO";
import { getConnection } from "./database";

export interface SaveAccount {
  accountId: string;
  name: string;
  email: string;
  cpf: string;
  carPlate?: string;
  isPassenger: boolean;
  isDriver?: boolean;
}

export default class AccountDAODatabase
  implements AccountDAO, SignupAccountDAO, GetAccountAccountDAO
{
  async save(account: SaveAccount) {
    const connection = getConnection();
    await connection.query(
      "insert into cccat14.account (account_id, name, email, cpf, car_plate, is_passenger, is_driver) values ($1, $2, $3, $4, $5, $6, $7)",
      [
        account.accountId,
        account.name,
        account.email,
        account.cpf,
        account.carPlate,
        !!account.isPassenger,
        !!account.isDriver,
      ]
    );
    await connection.$pool.end();
  }

  async getById(accountId: string) {
    const connection = getConnection();
    const [account] = await connection.query(
      "select * from cccat14.account where account_id = $1",
      [accountId]
    );
    await connection.$pool.end();
    return account;
  }

  async getByEmail(email: string) {
    const connection = getConnection();
    const [account] = await connection.query(
      "select * from cccat14.account where email = $1",
      [email]
    );
    await connection.$pool.end();
    return account;
  }
}
