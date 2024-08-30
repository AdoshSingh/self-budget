import prisma from "../prismaClient";
import { accountRepository } from "./accountRepository";
import type { TransactionType, BracketType } from "@/domain/prismaTypes";

class TransactionRepository {
  private static instance: TransactionRepository;
  private dbClient: typeof prisma;

  private constructor(dbClient: typeof prisma) {
    this.dbClient = dbClient;
  }

  public static getInstance(dbClient: typeof prisma) {
    if (!TransactionRepository.instance) {
      TransactionRepository.instance = new TransactionRepository(dbClient);
    }
    return TransactionRepository.instance;
  }

  public async getTransactions(accountId: string) {
    const existingTransactions = await this.dbClient.transaction.findMany({
      where: {
        accountId: accountId,
      },
    });
    return existingTransactions;
  }

  public async getOneTransaction(transactionId: string) {
    const existingTransaction = await this.dbClient.transaction.findUnique({
      where: {
        id: transactionId,
      },
    });
    return existingTransaction;
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
    const inputTransaction = {
      type,
      date,
      payee,
      bracket,
      payer,
      amount,
      accountId,
    };
    const { remaining, updated } = await accountRepository.updateAccount(
      inputTransaction, fundId
    );
    if (remaining != 0) return remaining;
    return await this.dbClient.transaction.create({
      data: inputTransaction,
    });
  }
}

export const transactionRepository = TransactionRepository.getInstance(prisma);
