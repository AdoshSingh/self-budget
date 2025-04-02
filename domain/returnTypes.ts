import type { Account } from "@/domain/prismaTypes";

export interface ReturnUpdatedAccount {
  remaining: number;
  updated: null | Account;
}

interface BaseReturnType {
  status: number;
  message?: string;
  data?: any;
}

export interface RepoResult extends BaseReturnType {}
export interface ServiceResponse extends BaseReturnType {}
