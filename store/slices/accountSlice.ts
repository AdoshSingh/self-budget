import { StateCreator } from "zustand";
import { Account } from "@/domain/prismaTypes";
import { accountApiService } from "@/clients/api/accountService";

export interface AccountSlice {
  account: Account | null | undefined;
  setAccount: (userId: string, toast: any) => void;
}

export const createAccountSlice: StateCreator<AccountSlice> = (set) => ({
  account: undefined,
  setAccount: async (userId: string, toast: any) => {
    const response = await accountApiService.getAccount(userId);
    if (!response || response.status >= 400 || !response.data) {
      toast({
        description: response?.message || "Failed to fetch account details!",
        variant: "destructive",
      });
      return;
    }
    set({ account: response.data });
    toast({
      description: response?.message || "Account fetched successfully",
      variant: "default",
    });
  },
});
