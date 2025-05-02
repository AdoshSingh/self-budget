import prisma from "../prismaClient";
import { accountRepository } from "./accountRepository";
import type { TransactionType, BracketType } from "@/domain/prismaTypes";
import Logger from "@/utils/logger";
import type { RepoResult } from "@/domain/returnTypes";

class TransactionRepository {
  private static instance: TransactionRepository;
  private dbClient: typeof prisma;
  private logger: Logger;

  private constructor(dbClient: typeof prisma) {
    this.dbClient = dbClient;
    this.logger = new Logger();
  }

  public static getInstance(dbClient: typeof prisma) {
    if (!TransactionRepository.instance) {
      TransactionRepository.instance = new TransactionRepository(dbClient);
    }
    return TransactionRepository.instance;
  }

  public async getTransactions(accountId: string, userId: string): Promise<RepoResult> {
    try {
      const existingAccount = (await accountRepository.getAccount(userId)).data;
      if (!existingAccount) {
        return {status: 404, message: 'Account not found'};
      }
      const existingTransactions = await this.dbClient.transaction.findMany({
        where: {
          accountId: accountId,
        },
      });
      return {status: 200, message: 'Transactions retrieved successfully', data: existingTransactions};
    } catch (error) {
      this.logger.error(error, 'getTransactions', 'TransactionRepository');
      return {status: 500};
    }
  }

  public async getOneTransaction(transactionId: string): Promise<RepoResult> {
    try {
      const existingTransaction = await this.dbClient.transaction.findUnique({
        where: {
          id: transactionId,
        },
      });
      if (!existingTransaction) {
        return {status: 404, message: 'Transaction not found'};
      }
      return {status: 200, message: 'Transaction retrieved successfully', data: existingTransaction};
    } catch (error) {
      this.logger.error(error, 'getOneTransaction', 'TransactionRepository');
      return {status: 500};
    }
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
  ): Promise<RepoResult> {
    try {
      const inputTransaction = {
        type,
        date,
        payee,
        bracket,
        payer,
        amount,
        accountId,
      };
      if(!type || !date || !payee || !bracket || !payer || !amount || !accountId) {
        return {status: 400, message: 'Invalid Request. Please try again.'};
      }
  
      const result = await accountRepository.updateAccount(inputTransaction, fundId);
      if (result.status >= 400) {
        return {status: result.status, message: result.message};
      }
  
      const result2 = await this.dbClient.transaction.create({
        data: inputTransaction,
      });
      if (!result2) {
        return {status: 400, message: 'Invalid request. Please try again.'};
      }
      return {status: 201, message: 'Transaction created successfully', data: result2};
    } catch (error) {
      this.logger.error(error, 'getOneTransaction', 'TransactionRepository');
      return {status: 500};
    }
  }
}

export const transactionRepository = TransactionRepository.getInstance(prisma);
