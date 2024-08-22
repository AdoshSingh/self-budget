import { AddAccount } from "./AddAccount";

const NoAccountPlaceholder = ({ userId }: { userId: string }) => {
  return (
    <div>
      <h1>No account yet. Please add one</h1>
      <AddAccount userId={userId} />
    </div>
  );
};

export default NoAccountPlaceholder;
