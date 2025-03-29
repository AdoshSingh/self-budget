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
  DEBIT: ["NEED", "WANT", "INVEST"],
  TRANSFER: ["SURPLUS", "FUND_TRANSFER", "INTERNAL", "PENALTY"],
};

import { HomeIcon, DollarSign, BarChart2 } from "lucide-react";

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
  {
    route: '/analytics',
    key: 'analytics',
    icon: BarChart2
  }
];

export const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec'
]

export const monthNameToNumber: { [key: string]: number } = {
  Jan: 0,
  Feb: 1,
  Mar: 2,
  Apr: 3,
  May: 4,
  Jun: 5,
  Jul: 6,
  Aug: 7,
  Sep: 8,
  Oct: 9,
  Nov: 10,
  Dec: 11,
};

export const responseMessages: Record<'success' | 'fail' | 'error', string> = {
  success: 'Your request was successful!',
  fail: 'We couldn\'t complete your request. Please try again.',
  error: 'Internal Server Error. Please try again later.',
};
