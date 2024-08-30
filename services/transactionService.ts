import { transactionRepository } from "@/db/repositories/transactionRepository";
import type { TransactionType, BracketType } from "@/domain/prismaTypes";

class TransactionService {
  private static instance: TransactionService;
  private constructor() {}

  public static getInstance() {
    if (!TransactionService.instance) {
      TransactionService.instance = new TransactionService();
    }
    return TransactionService.instance;
  }

  public async getTransactions(accountId: string) {
    return await transactionRepository.getTransactions(accountId);
  }

  public async getOneTransaction(transactionId: string) {
    return await transactionRepository.getOneTransaction(transactionId);
  }

  public async addTransaction(
    type: TransactionType,
    date: Date,
    payee: string,
    bracket: BracketType,
    payer: string,
    amount: number,
    accountId: string,
    fundId?: string
  ) {
    return await transactionRepository.addTransaction(
      type,
      date,
      payee,
      bracket,
      payer,
      amount,
      accountId,
      fundId
    );
  }
}

const transactionService = TransactionService.getInstance();
export default transactionService;
