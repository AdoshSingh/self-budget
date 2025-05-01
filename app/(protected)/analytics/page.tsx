import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import AnalyticsContainer from "@/components/AnalyticsContainer";

const page = async () => {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return redirect("/auth/signin");
  }

  return <AnalyticsContainer userSession={session}/>
}

export default page