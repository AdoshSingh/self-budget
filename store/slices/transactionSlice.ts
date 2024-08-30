import { StateCreator } from "zustand";
import { Transaction } from "@/domain/prismaTypes";
import { transactionApiService } from "@/services/apiService";

export interface TransactionSlice {
  transactions: Transaction[] | undefined;
  setTransactions: (accountId: string) => void;
  addTransaction: (transaction: Transaction) => void;
}

export const createTransactionSlice: StateCreator<TransactionSlice> = (
  set
) => ({
  transactions: undefined,
  setTransactions: async (accountId: string) => {
    const existingTransactions = await transactionApiService.getTransactions(
      accountId
    );
    const sortedDates = existingTransactions.sort(
      (a: Transaction, b: Transaction) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    set({ transactions: sortedDates });
  },
  addTransaction: async (transaction: Transaction) => {
    set((state) => {
      if (!state.transactions) {
        return { transactions: [transaction] };
      } else {
        return { transactions: [...state.transactions, transaction] };
      }
    });
  },
});
