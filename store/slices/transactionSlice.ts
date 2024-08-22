import { StateCreator } from "zustand";
import { Transaction } from "@/domain/prismaTypes";
import { transactionApiService } from "@/services/apiService";

export interface TransactionSlice {
  transactions: Transaction[];
  setTransactions: (accountId: string) => void;
  addTransaction: (transaction: Transaction) => void;
}

export const createTransactionSlice: StateCreator<TransactionSlice> = (
  set
) => ({
  transactions: [],
  setTransactions: async (accountId: string) => {
    const existingTransactions = await transactionApiService.getTransactions(
      accountId
    );
    set({ transactions: existingTransactions });
  },
  addTransaction: async (transaction: Transaction) => {
    set((state) => ({ transactions: [...state.transactions, transaction] }));
  },
});
