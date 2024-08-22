import type { Account } from "@/domain/prismaTypes";
import { useAppStore } from "@/store/store";

const AccountInfo = () => {
  const { account } = useAppStore();
  if(!account) {
    return <h2>Loading</h2>
  }
  return (
    <div>
      <h1>Primary Balance: {account.primary_balance}</h1>
      <h1>Needs: {account.need}</h1>
      <h1>Wants: {account.want}</h1>
      <h1>Investments: {account.investment}</h1>
      <h1>Secondary Balance: {account.secondary_balance}</h1>
    </div>
  );
};

export default AccountInfo;
