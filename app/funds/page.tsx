import FundContainer from "@/components/FundContainer";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import accountService from "@/services/accountService";
import fundService from "@/services/fundService";

const page = async () => {
  const session = await getServerSession(authOptions);
  if (!session) {
    return redirect("/auth/signin");
  }
  const account = await accountService.getAccount(session.user.id);
  if (!account) {
    return redirect("/auth/signin");
  }

  const funds = await fundService.getAllFunds(account.id);

  return <FundContainer userSession={session} funds={funds} />;
};

export default page;
