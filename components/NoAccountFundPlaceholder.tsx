import Link from "next/link";

const NoAccountFundPlaceholder = () => {
  return (
    <div>
      Please create an account first
      <Link href={"/"}>
        <h1 className=" capitalize">Go to home page</h1>
      </Link>
    </div>
  );
};

export default NoAccountFundPlaceholder;
