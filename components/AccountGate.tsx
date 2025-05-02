"use client";

import { useAccountStore } from "@/store/accountStore";
import AccountInfo from "./AccountInfo";
import NoAccountPlaceholder from "./NoAccountPlaceholder";
import { AccountSkeleton } from "./AccountSkeleton";

const AccountGate = () => {
    const { accountExists } = useAccountStore((state) => ({
        accountExists: state.accountExists
    }));

    if(accountExists === null) return <AccountSkeleton />
    if(accountExists === false) return <NoAccountPlaceholder />
    return <AccountInfo />
}

export default AccountGate