"use client";
import { useEffect } from "react";
import type { Session } from "next-auth";
import NoAccountFundPlaceholder from "./NoAccountFundPlaceholder";
import { FundSkeleton } from "./FundSkeleton";
import { useAccountStore } from "@/store/accountStore";
import { useFundStore } from "@/store/fundStore";
import FundsGate from "./FundsGate";

const FundContainer = ({
  userSession
}: {
  userSession: Session;
}) => {

  const fetchAccount = useAccountStore((state) => state.fetchAccount);
  const fetchFunds = useFundStore((state) => state.fetchFunds);
  const accountExists = useAccountStore((state) => state.accountExists);
  
  useEffect(() => {
    if(accountExists === null) {
      fetchAccount(userSession.user.id);
    } else if(accountExists === true) {
      const accountId = useAccountStore.getState().account?.id;
      const funds = useFundStore.getState().funds;
      if(accountId && funds === null){ 
        fetchFunds(accountId);
      }
    }
  }, [accountExists]);

  if(accountExists === null) return <FundSkeleton/>;
  if(accountExists === false) return <NoAccountFundPlaceholder/>;

  return <FundsGate />
};

export default FundContainer;
