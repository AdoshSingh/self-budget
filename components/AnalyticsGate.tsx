"use client";
import { useTransactionStore } from "@/store/transactionStore"
import AnalyticsCharts from "./AnalyticsCharts";

const AnalyticsGate = () => {
  const transactions = useTransactionStore((state) => state.transactions);
  const loading = useTransactionStore((state) => state.loading);

  if(loading) return <div>Loading...</div>
  if(!transactions || transactions.length === 0) return <div>No Transactions</div>

  return <AnalyticsCharts transactions={transactions}/>

}

export default AnalyticsGate
