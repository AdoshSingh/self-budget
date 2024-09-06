"use client";
import { useEffect } from "react";
import { Session } from "next-auth";
import { useAppStore } from "@/store/store";
import { Fund } from "@/domain/prismaTypes";
import Funds from "./Funds";
import NoFundsPlaceholder from "./NoFundsPlaceholder";

const FundContainer = ({
  userSession,
  funds,
}: {
  userSession: Session;
  funds: Fund[];
}) => {
  const { session, account, setAccount, setSession, setFunds } = useAppStore();
  useEffect(() => {
    if (session && account) {
      setFunds(null, funds);
      return;
    } else if (session && !account) {
      setAccount(userSession.user.id);
      setFunds(null, funds);
      return;
    } else if (!session && account) {
      setSession(userSession);
      setFunds(null, funds);
      return;
    } else {
      setAccount(userSession.user.id);
      setSession(userSession);
      setFunds(null, funds);
    }
  }, []);

  if (funds.length === 0) {
    return <NoFundsPlaceholder />;
  } else {
    return <Funds />;
  }
};

export default FundContainer;
