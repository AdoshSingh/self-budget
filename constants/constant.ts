export const trasactionTypesOptions = ["CREDIT", "DEBIT", "TRANSFER"];

export const bracketTypeOptions = [
  "REFUND",
  "INCOME",
  "UNREGULATED",
  "NEED",
  "WANT",
  "INVEST",
  "FUND_DEBIT",
  "SURPLUS",
  "FUND_TRANSFER",
  "INTERNAL",
  "PENALTY",
];

export const transactionOptions = {
  CREDIT: ["REFUND", "INCOME", "UNREGULATED"],
  DEBIT: ["NEED", "WANT", "INVEST", "FUND_DEBIT"],
  TRANSFER: ["SURPLUS", "FUND_TRANSFER", "INTERNAL", "PENALTY"],
};

import { HomeIcon, DollarSign } from "lucide-react";

export const sidebarElements = [
  {
    route: '/',
    key: 'home',
    icon: HomeIcon
  },
  {
    route: '/funds',
    key: 'funds',
    icon: DollarSign
  },
];
