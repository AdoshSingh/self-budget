import { create } from "zustand";
import { type SessionSlice, createSessionSlice } from "./slices/sessionSlice";
import { type AccountSlice, createAccountSlice } from "./slices/accountSlice";
import {
  type TransactionSlice,
  createTransactionSlice,
} from "./slices/transactionSlice";
import { type FundSlice, createFundSlice } from "./slices/fundSlice";

export type StoreState = AccountSlice & TransactionSlice & SessionSlice & FundSlice;

export const useAppStore = create<StoreState>()((...a) => ({
  ...createAccountSlice(...a),
  ...createTransactionSlice(...a),
  ...createSessionSlice(...a),
  ...createFundSlice(...a)
}));
