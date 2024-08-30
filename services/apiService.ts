import axios from "axios";
import type { TransactionType, BracketType } from "@/domain/prismaTypes";
import type { TransactionRequest } from "@/domain/requestTypes";

class AccountApiService {
  private static instance: AccountApiService;
  private constructor() {}
  public static getInstance() {
    if (!AccountApiService.instance) {
      AccountApiService.instance = new AccountApiService();
    }
    return AccountApiService.instance;
  }

  public async addAccount(userId: string) {
    const newAccount = await axios.put("/api/account", { userId });
    return newAccount.data.data;
  }

  public async getAccount(userId: string) {
    const existingAccount = await axios.get(`/api/account?userid=${userId}`);
    console.log(existingAccount.data.data);
    return existingAccount.data.data;
  }
}

class TransactionApiService {
  private static instance: TransactionApiService;
  private constructor() {}
  public static getInstance() {
    if (!TransactionApiService.instance) {
      TransactionApiService.instance = new TransactionApiService();
    }
    return TransactionApiService.instance;
  }

  public async getTransactions(accountId: string) {
    const existingTransactions = await axios.get(
      `/api/transaction?accountid=${accountId}`
    );
    return existingTransactions.data.data;
  }

  public async getOneTransaction(accountId: string, transactionId: string) {
    const existingTransaction = await axios.get(
      `/api/transaction?accountid=${accountId}&transactionid:${transactionId}`
    );
    return existingTransaction.data.data;
  }

  public async addTransaction(
    args: TransactionRequest
  ) {
    
    const newTransaction = await axios.put(`/api/transaction`, {
      type: args.type,
      date: args.date,
      payee: args.payee,
      bracket: args.bracket,
      payer: args.payer,
      amount: args.amount,
      accountId: args.accountId,
      fundId: args.fundId,
    });
    return newTransaction.data.data;
  }
}

const accountApiService = AccountApiService.getInstance();
const transactionApiService = TransactionApiService.getInstance();

export { accountApiService, transactionApiService };
