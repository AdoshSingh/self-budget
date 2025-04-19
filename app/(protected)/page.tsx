import InfoContainer from "@/components/InfoContainer";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const page = async () => {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/signin");
  }
    
  return <InfoContainer userSession={session} />;
};

export default page;
