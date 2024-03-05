import { AccountRepository } from "../repository/AccountRepository";

export class GetAccount {
  constructor(private accountDao: AccountRepository) {}

  async execute(accountId: string) {
    return await this.accountDao.getById(accountId);
  }
}
