import type { Transaction } from "@/domain/prismaTypes";
import { DataTableDemo } from "./TransactionTable";
const Transactions = ({ transactions }: { transactions: Transaction[] }) => {
  return (
    <div className="p-6">
      <DataTableDemo transactions={transactions}/>
    </div>
  );
};

export default Transactions;
