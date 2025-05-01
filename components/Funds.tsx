"use client";

import { AddFund } from "./AddFund";
import { useFundStore } from "@/store/fundStore";
import FundCard from "./FundCard";

const Funds = () => {

  const funds = useFundStore((state) => state.funds);

  return (
    <div className="flex-1 p-6 h-full overflow-auto">
      <div className="flex justify-between items-center mb-4">
        <span className="text-2xl">Your Funds</span>
        <AddFund />
      </div>
      <div className="space-y-4">
        {funds?.map((ele) => (
          <FundCard key={ele.id} fund={ele}/>
        ))}
      </div>
    </div>
  );
};

export default Funds;
