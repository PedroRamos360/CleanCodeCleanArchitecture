import { SaveAccount } from "./AccountDAODatabase";
import GetAccountDAO from "./GetAccountDAO";
import SignupAccountDAO from "./SignupAccountDAO";
import { Account } from "./database";

export default interface AccountDAO extends SignupAccountDAO, GetAccountDAO {
  save(account: SaveAccount): Promise<void>;
  getById(accountId: string): Promise<Account>;
  getByEmail(email: string): Promise<Account>;
}
