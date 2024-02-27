import { randomUUID } from "crypto";

type TransactionStatus = "success" | "failed";

interface TransactionProps {
  transactionId: string;
  rideId: string;
  status: TransactionStatus;
  date: Date;
  amount: number;
}

export class Transaction {
  private constructor(
    readonly transactionId: string,
    readonly rideId: string,
    readonly status: TransactionStatus,
    readonly date: Date,
    readonly amount: number
  ) {}

  static create(rideId: string, status: TransactionStatus, amount: number) {
    const transactionId = randomUUID();
    const date = new Date();
    return new Transaction(transactionId, rideId, status, date, amount);
  }

  static restore(props: TransactionProps) {
    return new Transaction(
      props.transactionId,
      props.rideId,
      props.status,
      props.date,
      props.amount
    );
  }
}
