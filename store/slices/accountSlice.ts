import { StateCreator } from "zustand";
import { Account } from "@/domain/prismaTypes";
import { accountApiService } from "@/services/apiService";

export interface AccountSlice {
  account: Account | null | undefined;
  setAccount: (userId: string) => void;
}

export const createAccountSlice: StateCreator<AccountSlice> = (set) => ({
  account: undefined,
  setAccount: async (userId: string) => {
    const existingAccount = await accountApiService.getAccount(userId);
    set({ account: existingAccount });
  },
});
