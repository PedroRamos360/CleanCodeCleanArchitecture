import { Transaction } from "../../domain/Transaction";

export interface TransactionRepository {
  save(transaction: Transaction): Promise<{ transactionId: string }>;
  getByRideId(transactionId: string): Promise<Transaction | undefined>;
}