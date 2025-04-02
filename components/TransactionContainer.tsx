"use client";

import { useEffect } from "react";
import NoTransactionPlaceholder from "./NoTransactionPlaceholder";
import Transactions from "./Transactions";
import { useAppStore } from "@/store/store";
import { TransactionSkeleton } from "./TransactionSkeleton";
import { useToast } from "./ui/use-toast";

const TransactionContainer = () => {
  const { account, transactions, setTransactions } = useAppStore();
  const {toast} = useToast();

  useEffect(() => {
    if (account?.id) {
      setTransactions(account.id, toast);
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
