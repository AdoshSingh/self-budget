"use client";

import { Separator } from "./ui/separator";
import { convertToCurrency } from "@/utils/formatNumber";
import { useAccountStore } from "@/store/accountStore";

const AccountInfo = () => {

  const account = useAccountStore((state) => state.account);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <span className="text-2xl">Your Balances</span>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between font-bold">
          <span>Total Bank Balance:</span>{" "}
          <span className="flex items-center">
            {convertToCurrency(account?.total_balance)}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Primary Balance:</span>{" "}
          <span className="flex items-center">
            {convertToCurrency(account?.primary_balance)}
          </span>
        </div>
        <Separator />
        <div>
          <div className="flex justify-between">
            <span>Needs:</span>{" "}
            <span className="flex items-center">
              {convertToCurrency(account?.need)}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Wants:</span>{" "}
            <span className="flex items-center">
              {convertToCurrency(account?.want)}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Investments:</span>{" "}
            <span className="flex items-center">
              {convertToCurrency(account?.investment)}
            </span>
          </div>
        </div>
        <Separator />
        <div className="flex justify-between">
          <span>Secondary Balance:</span>{" "}
          <span className="flex items-center">
            {convertToCurrency(account?.secondary_balance)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AccountInfo;
