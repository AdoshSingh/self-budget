import { StateCreator } from "zustand";
import { Fund } from "@/domain/prismaTypes";
import { fundApiService } from "@/clients/api/fundService";

export interface FundSlice {
  funds: Fund[] | undefined;
  setFunds: (accountId: string | null, allFunds: Fund[] | null, toast: any) => void;
}

export const createFundSlice: StateCreator<FundSlice> = (set) => ({
  funds: undefined,
  setFunds: async (accountId: string | null, allFunds: Fund[] | null, toast: any) => {
    if (allFunds) {
      set({ funds: allFunds });
      return;
    } else if (accountId) {
      const response = await fundApiService.getAllFunds(accountId);
      if (!response || response.status >= 400 || !response.data) {
        toast({
          description: response?.message || "Failed to fetch account details!",
          variant: "destructive",
        });
        return;
      }
      set({ funds: response.data });
      toast({
        description: response?.message || "Funds fetched successfully",
        variant: "default",
      });
    }
  },
});
