"use client";

import { getSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import NoAccountPlaceholder from "./NoAccountPlaceholder";
import AccountContainer from "./AccountContainer";
import { useAppStore } from "@/store/store";

export default function InfoContainer() {
  const router = useRouter();

  const { account, setAccount, session, setSession } = useAppStore();

  useEffect(() => {
    getSession().then((sesh) => {
      if (!sesh) {
        router.push("/auth/signin");
        return;
      }
      setSession(sesh)
    });
  }, []);

  useEffect(() => {
    if (!session) return;
    setAccount(session.user.id);
  }, [session]);

  if (!account) {
    return <NoAccountPlaceholder userId={session?.user.id} />;
  } else {
    return <AccountContainer/>;
  }
}
