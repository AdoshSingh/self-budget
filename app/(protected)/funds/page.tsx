import FundContainer from "@/components/FundContainer";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const page = async () => {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return redirect("/auth/signin");
  }

  return <FundContainer userSession={session} />;
};

export default page;
