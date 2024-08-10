import type { Account } from "@/domain/prismaTypes";

export interface ReturnUpdatedAccount {
  remaining: number;
  updated: null | Account;
}
