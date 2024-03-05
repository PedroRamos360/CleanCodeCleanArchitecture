import crypto from "crypto";

export type TransactionStatus = "waiting_payment" | "paid";

export class Transaction {
  private constructor(
    readonly transactionId: string,
    readonly rideId: string,
    readonly amount: number,
    readonly date: Date,
    private status: TransactionStatus
  ) {}

  static create(rideId: string, amount: number) {
    const transactionId = crypto.randomUUID();
    const status = "waiting_payment";
    const date = new Date();
    return new Transaction(transactionId, rideId, amount, date, status);
  }

  static restore(
    transactionId: string,
    rideId: string,
    amount: number,
    date: Date,
    status: TransactionStatus
  ) {
    return new Transaction(transactionId, rideId, amount, date, status);
  }

  pay() {
    this.status = "paid";
  }

  getStatus() {
    return this.status;
  }
}
