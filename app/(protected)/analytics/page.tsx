import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import AnalyticsContainer from "@/components/AnalyticsContainer";
import AnalyticsCharts from "@/components/AnalyticsCharts";
import accountService from "@/services/accountService";
import transactionService from "@/services/transactionService";

const page = async () => {

  const session = await getServerSession(authOptions);
  if (!session) {
    return redirect("/auth/signin");
  }
  const account = (await accountService.getAccount(session.user.id)).data;
  if (!account) {
    return redirect("/auth/signin");
  }

  const transactions = (await transactionService.getTransactions(account.id, session.user.id)).data;
  if(!transactions || transactions.length === 0) {
    return <div>No Transactions</div>
  }

  return <AnalyticsCharts transactions={transactions}/>

  // const session = await getServerSession(authOptions);
  
  // if (!session) {
  //   return redirect("/auth/signin");
  // }

  // return <AnalyticsContainer/>
}

export default page