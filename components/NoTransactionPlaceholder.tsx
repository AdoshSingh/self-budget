import { AddTransaction } from "./AddTransaction";
const NoTransactionPlaceholder = () => {
  return (
    <div>
      <h1>No transactions yet.</h1>
      <AddTransaction />
    </div>
  );
};

export default NoTransactionPlaceholder;
