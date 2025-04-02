"use client";
import { useEffect } from "react";
import { Session } from "next-auth";
import { useAppStore } from "@/store/store";
import { Fund } from "@/domain/prismaTypes";
import Funds from "./Funds";
import NoFundsPlaceholder from "./NoFundsPlaceholder";
import { useToast } from "./ui/use-toast";

const FundContainer = ({
  userSession,
  funds,
}: {
  userSession: Session;
  funds: Fund[];
}) => {
  const { session, account, setAccount, setSession, setFunds } = useAppStore();
  const { toast } = useToast();
  
  useEffect(() => {
    if (session && account) {
      setFunds(null, funds, toast);
      return;
    } else if (session && !account) {
      setAccount(userSession.user.id, toast);
      setFunds(null, funds, toast);
      return;
    } else if (!session && account) {
      setSession(userSession);
      setFunds(null, funds, toast);
      return;
    } else {
      setAccount(userSession.user.id, toast);
      setSession(userSession);
      setFunds(null, funds, toast);
    }
  }, []);

  if (funds.length === 0) {
    return <NoFundsPlaceholder />;
  } else {
    return <Funds />;
  }
};

export default FundContainer;
