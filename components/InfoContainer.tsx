import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import accountService from "@/services/accountService";
import { AddAccount } from "./AddAccount";

export default async function InfoContainer() {
  const session = await getServerSession(authOptions);
  let accounts;
  if (session?.user.id) {
    accounts = await accountService.getAccount(session.user.id);
    console.log(accounts);
  }

  if (!accounts) {
    return (
      <div>
        <h1>No account yet. Please add one</h1>
        <AddAccount />
      </div>
    );
  }

  return (
    <div className="">
      <div>
        {session && session.user ? (
          <div>{session.user.id}</div>
        ) : (
          <a className="btn btn-primary" href="/api/auth/signin">
            Sign in
          </a>
        )}
      </div>
    </div>
  );
}
