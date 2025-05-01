"use client";

import type { Session } from "next-auth";
import { useAccountStore } from "@/store/accountStore";
import { useEffect } from "react";
import { useTransactionStore } from "@/store/transactionStore";
import AnalyticsGate from "./AnalyticsGate";

const AnalyticsContainer = ({ userSession }: { userSession: Session }) => {
  const fetchAccount = useAccountStore((state) => state.fetchAccount);
  const accountExists = useAccountStore((state) => state.accountExists);
  const fetchTransactions = useTransactionStore((state) => state.fetchTransactions);

  useEffect(() => {
    if (accountExists === null) {
      fetchAccount(userSession.user.id);
    } else if (accountExists === true) {
      const accountId = useAccountStore.getState().account?.id;
      const transactions = useTransactionStore.getState().transactions;
      if (accountId && transactions === null) {
        fetchTransactions(accountId);
      }
    }
  }, [accountExists]);

  if(accountExists === null) return <div>Loading...</div>;
  if(accountExists === false) return <div>No account</div>;

  return <AnalyticsGate />
};

export default AnalyticsContainer;
