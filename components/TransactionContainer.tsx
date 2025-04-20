"use client";

import { useEffect } from "react";
import Transactions from "./Transactions";
import { TransactionSkeleton } from "./TransactionSkeleton";
import { useToast } from "./ui/use-toast";
import { useAccountStore } from "@/store/accountStore";
import { useTransactionStore } from "@/store/transactionStore";
import TransactionGate from "./TransactionGate";

const TransactionContainer = () => {
  
  const fetchTransactions = useTransactionStore((state) => state.fetchTransactions);
  const accountExists = useAccountStore((state) => state.accountExists);

  useEffect(() => {
    if(accountExists){
      const accountId = useAccountStore.getState().account?.id;
      if(accountId) {
        fetchTransactions(accountId);
      }
    }
  }, [accountExists]);

  if(!accountExists) return null; 

  return <TransactionGate />
};

export default TransactionContainer;
