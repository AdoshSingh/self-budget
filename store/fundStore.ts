import { create } from "zustand";
import { fundApiService } from "@/clients/api/fundService";
import type { Fund } from "@/domain/prismaTypes";

type FundStore = {
  funds: Fund[] | null;
  loading: boolean;
  error: string | null;
  fetchFunds: (accountId: string) => Promise<void>;
  addFund: (fund: Fund) => void;
  removeFund: (fundId: string) => void;
};

export const useFundStore = create<FundStore>((set) => ({
  funds: null,
  loading: false,
  error: null,
  fetchFunds: async (accountId: string) => {
    set(() => ({ loading: true, error: null }));
    try {
      const response = await fundApiService.getAllFunds(accountId);
      if (!response || response.status >= 400 || !response.data) {
        set(() => ({
          error: response?.message || "Failed to fetch funds",
          loading: false,
        }));
        return;
      }
      set(() => ({
        funds: response.data,
        loading: false,
      }));
    } catch (error) {
      set(() => ({
        error: 'Failed to fetch funds. Please try again.',
        loading: false,
      }));
    }
  },
  addFund: (fund: Fund) => {
    set((state) => {
      if (!state.funds) {
        return { funds: [fund] };
      } else {
        return { funds: [...state.funds, fund] };
      }
    });
  },
  removeFund: (fundId: string) => {
    set((state) => ({
      funds: state.funds ? state.funds.filter((fund) => fund.id !== fundId) : null,
    }));
  },
}));
