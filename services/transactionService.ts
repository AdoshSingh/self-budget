import { transactionRepository } from "@/db/repositories/transactionRepository";
import type { TransactionType, BracketType } from "@/domain/prismaTypes";
import ResponseWrapper from "@/utils/responseWrapper";
import Logger from "@/utils/logger";
import type { RepoResult } from "@/domain/returnTypes";

class TransactionService {
  private static instance: TransactionService;
  private responseWrapper: ResponseWrapper;
  private logger: Logger;

  private constructor() {
    this.responseWrapper = new ResponseWrapper();
    this.logger = new Logger();
  }

  public static getInstance() {
    if (!TransactionService.instance) {
      TransactionService.instance = new TransactionService();
    }
    return TransactionService.instance;
  }

  public async getTransactions(accountId: string): Promise<RepoResult> {
    try {
      const result = await transactionRepository.getTransactions(accountId);
      return this.responseWrapper.response(result.status, result.message, result.data);
    } catch (error) {
      this.logger.error(error, 'getTransactions', 'TransactionService');
      return this.responseWrapper.error();
    }
  }

  public async getOneTransaction(transactionId: string): Promise<RepoResult> {
    try {
      const result = await transactionRepository.getOneTransaction(transactionId);
      return this.responseWrapper.response(result.status, result.message, result.data);
    } catch (error) {
      this.logger.error(error, 'getOneTransaction', 'TransactionService');
      return this.responseWrapper.error();
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
      const result = await transactionRepository.addTransaction(
        type,
        date,
        payee,
        bracket,
        payer,
        amount,
        accountId,
        fundId
      );
      return this.responseWrapper.response(result.status, result.message, result.data);
    } catch (error) {
      this.logger.error(error, 'addTransaction', 'TransactionService');
      return this.responseWrapper.error();
    }
  }
}

const transactionService = TransactionService.getInstance();
export default transactionService;
