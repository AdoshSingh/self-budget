import { StateCreator } from "zustand";
import { Account } from "@/domain/prismaTypes";
import { accountApiService } from "@/services/apiService";

export interface AccountSlice {
  account: Account | null;
  setAccount: (userId: string) => void;
}

export const createAccountSlice: StateCreator<AccountSlice> = (set) => ({
  account: null,
  setAccount: async (userId: string) => {
    const existingAccount = await accountApiService.getAccount(userId);
    set({ account: existingAccount });
  },
});
