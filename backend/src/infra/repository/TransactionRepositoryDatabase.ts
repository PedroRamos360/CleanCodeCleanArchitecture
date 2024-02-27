import { TransactionRepository } from "../../application/repository/TransactionRepository";
import { Transaction } from "../../domain/Transaction";
import { DatabaseConnection } from "../database/DatabaseConnection";

export class TransactionRepositoryDatabase implements TransactionRepository {
  constructor(private connection: DatabaseConnection) {}

  async save(transaction: Transaction) {
    await this.connection.query(
      "insert into cccat14.transaction (transaction_id, ride_id, amount, date, status) values ($1, $2, $3, $4, $5)",
      [
        transaction.transactionId,
        transaction.rideId,
        transaction.amount,
        transaction.date,
        transaction.status,
      ]
    );
    return { transactionId: transaction.transactionId };
  }

  async getById(transactionId: string): Promise<Transaction | undefined> {
    const [transaction] = await this.connection.query(
      "select * from cccat14.transaction where transaction_id = $1",
      [transactionId]
    );
    if (!transaction) return undefined;
    return Transaction.restore({
      transactionId: transaction.transaction_id,
      rideId: transaction.ride_id,
      amount: transaction.amount,
      date: transaction.date,
      status: transaction.status,
    });
  }
}
