"use client";

import { useEffect, useState } from "react";
import type { Transaction } from "@/domain/prismaTypes";
import { transactionApiService } from "@/services/apiService";
import NoTransactionPlaceholder from "./NoTransactionPlaceholder";
import Transactions from "./Transactions";
import { useAppStore } from "@/store/store";

const TransactionContainer = () => {
  // const [transactions, setTransactions] = useState<Transaction[] | [] | null>(
  //   []
  // ); // will change the default value

  const { account, transactions, setTransactions } = useAppStore();

  useEffect(() => {
    if (account?.id) {
      setTransactions(account.id);
      // transactionApiService.getTransactions(account.id).then((data) => {
      //   console.log(data);
      //   setTransactions(data);
      // });
    }
  }, [account]);

  if (!transactions || transactions.length === 0) {
    return <NoTransactionPlaceholder />;
  } else {
    return <Transactions />;
  }
};

export default TransactionContainer;
