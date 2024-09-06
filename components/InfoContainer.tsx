"use client";
import { useEffect } from "react";
import NoAccountPlaceholder from "./NoAccountPlaceholder";
import AccountContainer from "./AccountContainer";
import { useAppStore } from "@/store/store";
import LoaderPage from "./LoaderPage";
import { Session } from "next-auth";
import { AccountSkeleton } from "./AccountSkeleton";
import { TransactionSkeleton } from "./TransactionSkeleton";

export default function InfoContainer({
  userSession,
}: {
  userSession: Session;
}) {
  const { account, setAccount, setSession } = useAppStore();
  useEffect(() => {
    setSession(userSession);
    setAccount(userSession.user.id);
  }, []);

  if (account === undefined) {
    return (
      <div className="flex-1">
        <AccountSkeleton />
        <TransactionSkeleton/>
      </div>
    );
  } else if (account === null) {
    return <NoAccountPlaceholder userId={userSession.user.id} />;
  } else {
    return <AccountContainer />;
  }
}
