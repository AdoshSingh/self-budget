"use client";

import { useEffect } from "react";
import { TransactionSkeleton } from "./TransactionSkeleton";
import { useAccountStore } from "@/store/accountStore";
import { useTransactionStore } from "@/store/transactionStore";
import TransactionGate from "./TransactionGate";

const TransactionContainer = () => {
  
  const fetchTransactions = useTransactionStore((state) => state.fetchTransactions);
  const accountExists = useAccountStore((state) => state.accountExists);

  useEffect(() => {
    if(accountExists){
      const accountId = useAccountStore.getState().account?.id;
      const transactions = useTransactionStore.getState().transactions;
      if(accountId && transactions === null){ 
        fetchTransactions(accountId);
      }
    }
  }, [accountExists]);

  if(accountExists === null) return <TransactionSkeleton/>;
  if(accountExists === false) return null; 

  return <TransactionGate />
};

export default TransactionContainer;
