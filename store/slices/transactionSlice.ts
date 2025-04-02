import { StateCreator } from "zustand";
import { Transaction } from "@/domain/prismaTypes";
import { transactionApiService } from "@/clients/api/transactionService";

export interface TransactionSlice {
  transactions: Transaction[] | undefined;
  setTransactions: (accountId: string, toast: any) => void;
  addTransaction: (transaction: Transaction) => void;
}

export const createTransactionSlice: StateCreator<TransactionSlice> = (
  set
) => ({
  transactions: undefined,
  setTransactions: async (accountId: string, toast: any) => {
    const response = await transactionApiService.getTransactions(accountId);
    if(!response || response.status >= 400 || !response.data) {
      toast({
        description: response?.message || "Failed to fetch transactions",
        variant: "destructive",
      });
      return;
    }
    const sortedDates = response.data?.sort(
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
