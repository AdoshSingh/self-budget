import { create } from "zustand";
import { transactionApiService } from "@/clients/api/transactionService";
import type { Transaction } from "@/domain/prismaTypes";

type TransactionStore = {
  transactions: Transaction[] | null;
  loading: boolean;
  error: string | null;
  fetchTransactions: (accountId: string) => Promise<void>;
  addTransaction: (transaction: Transaction) => void;
};

export const useTransactionStore = create<TransactionStore>((set) => ({
  transactions: null,
  loading: false,
  error: null,
  fetchTransactions: async (accountId: string) => {
    set(() => ({ loading: true, error: null }));
    try {
      const response = await transactionApiService.getTransactions(accountId);

      if (!response || response.status >= 400 || !response.data) {
        set(() => ({
          error: response?.message || "Failed to fetch transactions",
          loading: false,
        }));
        return;
      }

      const sortedDates = response.data.sort(
        (a: Transaction, b: Transaction) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      set(() => ({ transactions: sortedDates, loading: false }));
    } catch (error) {
      set(() => ({
        error: 'Failed to fetch transactions. Please try again.',
        loading: false,
      }));
    }
  },
  addTransaction: (transaction: Transaction) => {
    set((state) => {
      if (!state.transactions) {
        return { transactions: [transaction] };
      } else {
        const latestTransactionDate = new Date(state.transactions[0].date);
        const newTransactionDate = new Date(transaction.date);
        if (newTransactionDate.getTime() < latestTransactionDate.getTime()) {
          let ind = 0;
          for (let i = 0; i < state.transactions.length; i++) {
            const currentTransactionDate = new Date(state.transactions[i].date);
            if (newTransactionDate.getTime() > currentTransactionDate.getTime()) {
              ind = i;
              break;
            }
          }
          return {
            transactions: [
              ...state.transactions.slice(0, ind),
              transaction,
              ...state.transactions.slice(ind),
            ],
          };
        }
        return { transactions: [transaction, ...state.transactions] };
      }
    });
  },
}));