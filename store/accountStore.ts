import { create } from "zustand";
import { accountApiService } from "@/clients/api/accountService";
import type { Account } from "@/domain/prismaTypes";

type AccountStore = {
  account: Account | null;
  accountExists: boolean | null;
  loading: boolean;
  error: string | null;
  fetchAccount: (userId: string) => Promise<void>;
};

export const useAccountStore = create<AccountStore>((set) => ({
  account: null,
  accountExists: null,
  loading: false,
  error: null,
  fetchAccount: async (userId: string) => {
    set(() => ({ loading: true, error: null }));
    try {
      const response = await accountApiService.getAccount(userId);

      if(response?.status === 404) {
        set(() => ({
          accountExists: false,
          error: "Account not found!",
          loading: false,
        }));
        return;
      }
      if (!response || response.status >= 400 || !response.data) {
        set(() => ({
          error: response?.message || "Failed to fetch account details!",
          loading: false,
        }));
        return;
      }
      set(() => ({
        accountExists: true,
        account: response.data,
        loading: false,
      }));
    } catch (error) {
      set(() => ({
        error: 'Failed to fetch account. Please try again.',
        loading: false,
      }));
    }
  },
}));
