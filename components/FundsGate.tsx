"use client";

import { useFundStore } from "@/store/fundStore";
import NoFundsPlaceholder from "./NoFundsPlaceholder";
import Funds from "./Funds";
import { FundSkeleton } from "./FundSkeleton";

const FundsGate = () => {

  const { loading, funds } = useFundStore((state) => ({
    loading: state.loading,
    funds: state.funds
  }));

  if (loading || funds === null) return <FundSkeleton/>;

  if (funds?.length === 0) return <NoFundsPlaceholder/>;

  return <Funds />;
}

export default FundsGate
