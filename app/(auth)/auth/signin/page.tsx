import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import SigninForm from "@/components/SigninForm";

export default async function SignInPage() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/");
  }

  return (
    <div className="p-8">
      <h1>Sign In</h1>
      <SigninForm></SigninForm>
    </div>
  );
}
