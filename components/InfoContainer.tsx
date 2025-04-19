"use client";
import { useEffect } from "react";
import NoAccountPlaceholder from "./NoAccountPlaceholder";
import AccountContainer from "./AccountContainer";
import { Session } from "next-auth";
import { AccountSkeleton } from "./AccountSkeleton";
import { TransactionSkeleton } from "./TransactionSkeleton";
import { useAccountStore } from "@/store/accountStore";
import { useTransactionStore } from "@/store/transactionStore";

export default function InfoContainer({
  userSession,
}: {
  userSession: Session;
}) {
  const accountStore = useAccountStore();
  const transactionStore = useTransactionStore();

  useEffect(() => {
    accountStore.fetchAccount(userSession.user.id).then(() => {
      if (accountStore.account) {
        transactionStore.fetchTransactions(accountStore.account.id);
      }
    });
  }, []);

  if (accountStore.loading || transactionStore.loading) {
    return (
      <div className="flex-1">
        <AccountSkeleton />
        <TransactionSkeleton />
      </div>
    );
  }

  if (accountStore.accountExists === false && accountStore.account === null) {
    return <NoAccountPlaceholder userId={userSession.user.id} />;
  } 
  
  if (accountStore.accountExists === true && accountStore.account) {
    return <AccountContainer />;
  }
}
