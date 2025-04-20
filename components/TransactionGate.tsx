import { useTransactionStore } from "@/store/transactionStore";
import { TransactionSkeleton } from "./TransactionSkeleton";
import Transactions from "./Transactions";

const TransactionGate = () => {

    const { transactions, loading } = useTransactionStore((state) => ({
        transactions: state.transactions,
        loading: state.loading
    }));

    if (loading) {
        return <TransactionSkeleton />;
    } else {
        return <Transactions transactions={transactions || []} />;
    }
}

export default TransactionGate