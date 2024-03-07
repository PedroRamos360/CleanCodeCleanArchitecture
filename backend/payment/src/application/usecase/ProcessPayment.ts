import { Transaction } from "../../domain/Transaction";
import { RideRepository } from "../repository/RideRepository";
import { TransactionRepository } from "../repository/TransactionRepository";

interface Input {
  rideId: string;
  amount: number;
}

export class ProcessPayment {
  constructor(
    private transactionRepository: TransactionRepository,
    private rideRepository: RideRepository
  ) {}

  async execute({ rideId, amount }: Input) {
    const transaction = Transaction.create(rideId, amount);
    if (amount < 0) throw new Error("Invalid amount");
    const ride = await this.rideRepository.getById(rideId);
    if (!ride) throw new Error("Ride not found");
    await this.transactionRepository.save(transaction);
  }
}
