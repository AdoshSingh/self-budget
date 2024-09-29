import { StateCreator } from "zustand";
import { Fund } from "@/domain/prismaTypes";
import { fundApiService } from "@/services/apiService";

export interface FundSlice {
  funds: Fund[] | undefined;
  setFunds: (accountId: string | null, allFunds: Fund[] | null) => void;
}

export const createFundSlice: StateCreator<FundSlice> = (set) => ({
  funds: undefined,
  setFunds: async (accountId: string | null, allFunds: Fund[] | null) => {
    if (allFunds) {
      set({ funds: allFunds });
      return;
    } else if (accountId) {
      console.log("coming here", accountId);
      const existingFunds = await fundApiService.getAllFunds(accountId);
      set({ funds: existingFunds });
    }
  },
});
