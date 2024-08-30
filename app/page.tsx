import Navbar from "@/components/Topbar";
import InfoContainer from "@/components/InfoContainer";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const page = async () => {
  const session = await getServerSession(authOptions);

  if(!session) {
    redirect('/auth/signin');
  } else {
    return (
      <div>
        <Navbar />
        <InfoContainer userSession={session}/>
      </div>
    );
  }

};

export default page;
