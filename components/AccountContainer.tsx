import type { Account } from "@/domain/prismaTypes";
import AccountInfo from "./AccountInfo";
import TransactionContainer from "./TransactionContainer";

const AccountContainer = () => {
  return (
    <div>
      <AccountInfo />
      <TransactionContainer />
    </div>
  );
};

export default AccountContainer;
