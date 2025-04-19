"use client";

import { useAccountStore } from "@/store/accountStore";
import AccountInfo from "./AccountInfo";
import NoAccountPlaceholder from "./NoAccountPlaceholder";
import { AccountSkeleton } from "./AccountSkeleton";

const AccountGate = () => {
    const { accountExists, loading } = useAccountStore((state) => ({
        accountExists: state.accountExists,
        loading: state.loading
    }));

    if(loading) return <AccountSkeleton />

    if(!accountExists) return <NoAccountPlaceholder />

    return <AccountInfo />
}

export default AccountGate