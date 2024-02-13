export default interface GetAccountDAO {
  getById(accountId: string, flag: boolean): Promise<any>;
}
