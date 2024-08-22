import axios from "axios";
import type { TransactionType, BracketType } from "@/domain/prismaTypes";

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
    type: TransactionType,
    date: any,
    payee: string,
    bracket: BracketType,
    payer: string,
    amount: number,
    accountId: string,
    fundId?: string
  ) {
    const newTransaction = await axios.post(`/api/transaction`, {
      type,
      date,
      payee,
      bracket,
      payer,
      amount,
      accountId,
      fundId,
    });
    return newTransaction.data.data;
  }
}

const accountApiService = AccountApiService.getInstance();
const transactionApiService = TransactionApiService.getInstance();

export { accountApiService, transactionApiService };
