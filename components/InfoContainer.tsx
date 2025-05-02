"use client";

import { useEffect } from "react";
import { Session } from "next-auth";
import { useAccountStore } from "@/store/accountStore";
import TransactionContainer from "./TransactionContainer";
import AccountGate from "./AccountGate";

export default function InfoContainer({
  userSession,
}: {
  userSession: Session;
}) {
  const fetchAccount = useAccountStore((state) => state.fetchAccount);

  useEffect(() => {
    const account = useAccountStore.getState().account;
    if(!account) fetchAccount(userSession.user.id);
  }, []); 

  return (
    <div className="flex-1 h-full overflow-auto">
      <AccountGate />
      <TransactionContainer/>
    </div>
  )
}
