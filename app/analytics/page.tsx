import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import accountService from "@/services/accountService";
import fundService from "@/services/fundService";
import AnalyticsCharts from "@/components/AnalyticsCharts";
import transactionService from "@/services/transactionService";

const page = async () => {
  const session = await getServerSession(authOptions);
  if (!session) {
    return redirect("/auth/signin");
  }
  const account = await accountService.getAccount(session.user.id);
  if (!account) {
    return redirect("/auth/signin");
  }

  const transactions = await transactionService.getTransactions(account.id);

  if(!transactions || transactions.length === 0) {
    return <div>No Transactions</div>
  }

  return (
    <AnalyticsCharts transactions={transactions}/>
  )
}

export default page