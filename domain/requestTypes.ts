import type { TransactionType, BracketType } from "@/domain/prismaTypes";

export interface TransactionRequest {
  type: TransactionType | "";
  date: Date;
  payee: string | "";
  bracket: BracketType | "";
  payer: string | "";
  amount: number;
  accountId: string | "";
  fundId?: string;
}
