import type { Account } from "@/domain/prismaTypes";
import AccountInfo from "./AccountInfo";
import TransactionContainer from "./TransactionContainer";

const AccountContainer = () => {
  return (
    <div className="flex-1 h-full overflow-auto">
      <AccountInfo />
      <TransactionContainer />
    </div>
  );
};

export default AccountContainer;
