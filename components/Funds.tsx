"use client";
import { useAppStore } from "@/store/store";
import { AddFund } from "./AddFund";

const Funds = () => {
  const { funds } = useAppStore();
  return (
    <div>
      {funds?.map((ele, id) => (
        <div key={id}>
          <div>{ele.title}</div>
          <div>{ele.target}</div>
          <div>{ele.installment}</div>
          <div>{ele.duration}</div>
          <div>{ele.balance}</div>
        </div>
      ))}
      <AddFund />
    </div>
  );
};

export default Funds;
