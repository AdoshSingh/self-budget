import { create } from "zustand";
import { type SessionSlice, createSessionSlice } from "./slices/sessionSlice";
import { type AccountSlice, createAccountSlice } from "./slices/accountSlice";
import {
  type TransactionSlice,
  createTransactionSlice,
} from "./slices/transactionSlice";

export type StoreState = AccountSlice & TransactionSlice & SessionSlice;

export const useAppStore = create<StoreState>()((...a) => ({
  ...createAccountSlice(...a),
  ...createTransactionSlice(...a),
  ...createSessionSlice(...a),
}));
