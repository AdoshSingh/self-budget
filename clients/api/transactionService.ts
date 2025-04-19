import { ApiService } from "../apiService";
import type { TransactionRequest } from "@/domain/requestTypes";
import type { Transaction } from "@/domain/prismaTypes";

class TransactionApiService {
  private static instance: TransactionApiService;
  private apiService: ApiService;

  private constructor() {
    this.apiService = new ApiService();
  }

  public static getInstance() {
    if (!TransactionApiService.instance) {
      TransactionApiService.instance = new TransactionApiService();
    }
    return TransactionApiService.instance;
  }

  public async getTransactions(accountId: string) {
    return await this.apiService.get<{status: number, message?: string, data: Transaction[] | null | undefined}>("/api/transaction", { accountId });
  }

  public async getOneTransaction(accountId: string, transactionId: string) {
    return await this.apiService.get<{status: number, message?: string, data?: any}>("/api/transaction", { accountId, transactionId });
  }

  public async addTransaction(args: TransactionRequest) {
    return await this.apiService.put<{status: number, message?: string, data?: any}>("/api/transaction", {
      type: args.type,
      date: args.date,
      payee: args.payee,
      bracket: args.bracket,
      payer: args.payer,
      amount: args.amount,
      accountId: args.accountId,
      fundId: args.fundId,
    });
  }
}

export const transactionApiService = TransactionApiService.getInstance();