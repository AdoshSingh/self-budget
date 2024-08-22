import { StateCreator } from "zustand";
import { Account } from "@/domain/prismaTypes";
import { accountApiService } from "@/services/apiService";
import { Session } from "next-auth";
import { getSession } from "next-auth/react";

export interface SessionSlice {
  session: Session | null;
  setSession: (session?: Session) => void;
}

export const createSessionSlice: StateCreator<SessionSlice> = (set) => ({
  session: null,
  setSession: async (session?: Session) => {
    if (session) {
      set({ session: session });
      return;
    }
    const sesh = await getSession();
    set({ session: sesh });
  },
});
