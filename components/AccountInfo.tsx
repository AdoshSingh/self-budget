"use client";
import { useAppStore } from "@/store/store";
import { Separator } from "./ui/separator";
import { IndianRupee } from "lucide-react";
import { AddTransaction } from "./AddTransaction";
import { convertToCurrency } from "@/utils/formatNumber";
import { useEffect, useState } from "react";
import { useToast } from "./ui/use-toast";

const AccountInfo = () => {
  const [totalBankBalance, setTotalBankBalance] = useState<number>();

  const { account, funds, setFunds } = useAppStore();
  const { toast } = useToast();
  
  useEffect(() => {
    if (account && !funds) {
      setFunds(account.id, null, toast);
    }

    if (account && funds) {
      const accountBalance =
        account.primary_balance + account.secondary_balance;
      let fundsBalance = 0;
      funds.forEach((ele) => {
        fundsBalance += ele.balance;
      });
      setTotalBankBalance(accountBalance + fundsBalance);
    }
  }, [account, funds]);
  if (!account) {
    return <h2>Loading</h2>;
  }


  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <span className="text-2xl">Your Balances</span>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between font-bold">
          <span>Total Bank Balance:</span>{" "}
          <span className="flex items-center">
            {convertToCurrency(totalBankBalance)}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Primary Balance:</span>{" "}
          <span className="flex items-center">
            {convertToCurrency(account.primary_balance)}
          </span>
        </div>
        <Separator />
        <div>
          <div className="flex justify-between">
            <span>Needs:</span>{" "}
            <span className="flex items-center">
              {convertToCurrency(account.need)}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Wants:</span>{" "}
            <span className="flex items-center">
              {convertToCurrency(account.want)}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Investments:</span>{" "}
            <span className="flex items-center">
              {convertToCurrency(account.investment)}
            </span>
          </div>
        </div>
        <Separator />
        <div className="flex justify-between">
          <span>Secondary Balance:</span>{" "}
          <span className="flex items-center">
            {convertToCurrency(account.secondary_balance)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AccountInfo;
