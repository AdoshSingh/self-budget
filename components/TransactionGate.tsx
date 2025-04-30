import { useTransactionStore } from "@/store/transactionStore";
import { TransactionSkeleton } from "./TransactionSkeleton";
import TransactionInfo from "./TransactionInfo";

const TransactionGate = () => {

    const { loading } = useTransactionStore((state) => ({
        loading: state.loading
    }));

    if (loading) return <TransactionSkeleton />;

    return <TransactionInfo/>;
}

export default TransactionGate