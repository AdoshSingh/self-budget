"use client";

import { useEffect } from "react";
import NoTransactionPlaceholder from "./NoTransactionPlaceholder";
import Transactions from "./Transactions";
import { useAppStore } from "@/store/store";
import { TransactionSkeleton } from "./TransactionSkeleton";

const TransactionContainer = () => {
  const { account, transactions, setTransactions } = useAppStore();

  useEffect(() => {
    if (account?.id) {
      setTransactions(account.id);
    }
  }, [account]);

  // if (!transactions || transactions.length === 0) {
  //   return <NoTransactionPlaceholder />;
  // } else {
  if (transactions === undefined) {
    return <TransactionSkeleton />;
  } else {
    return <Transactions transactions={transactions || []} />;
  }
  // }
};

export default TransactionContainer;
