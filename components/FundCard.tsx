"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import type { Fund } from "@/domain/prismaTypes";
import type { TransactionRequest } from "@/domain/requestTypes";
import { convertToCurrency } from "@/utils/formatNumber";
import { Button } from "@/components/ui/button";
import { ChevronRightIcon } from "lucide-react";
import { Separator } from "./ui/separator";
import { CustomDropdown } from "./CustomDropdown";
import { useState } from "react";
import { useToast } from "./ui/use-toast";
import { transactionApiService } from "@/clients/api/transactionService";
import { useAccountStore } from "@/store/accountStore";
import { useTransactionStore } from "@/store/transactionStore";
import { useFundStore } from "@/store/fundStore";
import { fundApiService } from "@/clients/api/fundService";

const FundCard = ({ fund }: { fund: Fund }) => {
  const [open, setOpen] = useState<boolean>(false);
  const [selection, setSelection] = useState<string>("");

  const account = useAccountStore((state) => state.account);
  const addTransaction = useTransactionStore((state) => state.addTransaction);
  const { updateFund, removeFund } = useFundStore((state) => ({
    updateFund: state.updateFund,
    removeFund: state.removeFund,
  }));

  const { toast } = useToast();

  const addInstallment = async (
    e: React.FormEvent<HTMLFormElement>,
    args: Omit<TransactionRequest, "accountId">,
    fundId: string
  ) => {
    e.preventDefault();

    if (!account) return;

    if (
      args.type === "" ||
      args.bracket === "" ||
      args.amount <= 0 ||
      !args.date ||
      args.payee === "" ||
      args.payer === ""
    ) {
      toast({
        variant: "destructive",
        title: "Invalid inputs",
        description: "Please fill all the inputs before adding a transaction",
      });
      return;
    }

    if (args.payer === "NEED" && args.amount > account.need) {
      toast({
        variant: "destructive",
        title: "Insufficient balance",
        description: "Your needs dont have enough amount.",
      });
      return;
    } else if (args.payer === "WANT" && args.amount > account.want) {
      toast({
        variant: "destructive",
        title: "Insufficient balance",
        description: "Your wants dont have enough amount.",
      });
      return;
    }

    const response = await transactionApiService.addTransaction({
      ...args,
      accountId: account.id,
      fundId,
    });
    if (!response || response.status >= 400 || !response.data) {
      toast({
        variant: "destructive",
        description: response.message || "Something went wrong",
      });
      return;
    }

    addTransaction(response.data);
    useAccountStore.setState((state) => {
      if (!state.account) return {};

      const payerFeild: Record<
        string,
        keyof Pick<typeof account, "need" | "want">
      > = {
        NEED: "need",
        WANT: "want",
      };
      const payerKey = payerFeild[args.payer];

      return {
        account: {
          ...state.account,
          primary_balance: state.account.primary_balance - args.amount,
          [payerKey]: state.account[payerKey] - args.amount,
        },
      };
    });

    const updatedFund: Fund = { ...fund, balance: fund.balance + args.amount };
    updateFund(updatedFund);

    toast({ description: "Installment added successfully" });
    setOpen(false);
  };

  const withdrawAmount = async (
    e: React.FormEvent<HTMLFormElement>,
    args: Omit<TransactionRequest, "accountId">,
    fundId: string
  ) => {
    e.preventDefault();

    if (!account) return;

    if (
      args.type === "" ||
      args.bracket === "" ||
      args.amount <= 0 ||
      !args.date ||
      args.payee === "" ||
      args.payer === ""
    ) {
      toast({
        variant: "destructive",
        title: "Invalid inputs",
        description: "Please fill all the inputs before adding a transaction",
      });
      return;
    }

    const response = await transactionApiService.addTransaction({
      ...args,
      accountId: account.id,
      fundId,
    });
    if (!response || response.status >= 400 || !response.data) {
      toast({
        variant: "destructive",
        description: response.message || "Something went wrong",
      });
      return;
    }

    const response2 = await fundApiService.deleteFund(fundId);
    if (!response2 || response2.status >= 400 || !response2.data) {
      toast({
        variant: "destructive",
        description: response2.message || "Something went wrong",
      });
      return;
    }

    addTransaction(response.data);
    useAccountStore.setState((state) => {
      if (!state.account) return {};

      const payeeField: Record<
        string,
        keyof Pick<typeof account, "need" | "want">
      > = {
        NEED: "need",
        WANT: "want",
      };
      const payeeKey = payeeField[args.payee];

      return {
        account: {
          ...state.account,
          primary_balance: state.account.primary_balance + args.amount,
          [payeeKey]: state.account[payeeKey] + args.amount,
        },
      };
    });

    removeFund(fund.id);
    toast({ description: "Withdrawn money successfully" });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div className={` border border-gray-300 p-3 w-full rounded-lg `}>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1">
              <span className="font-bold text-xl">{fund.title}</span>
            </div>
            <div className="flex text-sm text-gray-500 items-center gap-1">
              <h1 className="">Target:</h1>
              <span>{convertToCurrency(fund.target)}</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className=" text-xl ">{convertToCurrency(fund.balance)}</div>
            <DialogTrigger asChild>
              <ChevronRightIcon className=" scale-75 cursor-pointer rounded-full hover:bg-slate-300 transition-all" />
            </DialogTrigger>
          </div>
        </div>
      </div>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{fund.title}</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 p-2 border rounded-lg ">
          <div className="flex justify-between items-center gap-4">
            <h1 className="text-gray-500">Target</h1>
            <span>{convertToCurrency(fund.target)}</span>
          </div>
          <div className="flex justify-between items-center gap-4">
            <h1 className="text-gray-500">Installment</h1>
            <span>{convertToCurrency(fund.installment)}</span>
          </div>
          <div className="flex justify-between items-center gap-4">
            <h1 className="text-gray-500">Duration</h1>
            <span>{fund.duration + " months"}</span>
          </div>
          <Separator />
          <div className="flex justify-between items-center gap-4">
            <h1 className="text-gray-500">Balance</h1>
            <span>{convertToCurrency(fund.balance)}</span>
          </div>
        </div>
        <DialogFooter>
          <form
            onSubmit={(e) => {
              if (fund.target > fund.balance) {
                addInstallment(
                  e,
                  {
                    type: "TRANSFER",
                    date: new Date(),
                    payee: `Fund: ${fund.title}`,
                    payer: selection,
                    bracket: "FUND_TRANSFER",
                    amount: fund.installment,
                  },
                  fund.id
                );
              } else {
                withdrawAmount(
                  e,
                  {
                    type: "TRANSFER",
                    date: new Date(),
                    payee: selection,
                    payer: `Fund: ${fund.title}`,
                    bracket: "FUND_DEBIT",
                    amount: fund.balance,
                  },
                  fund.id
                );
              }
            }}
            className="grid gap-4 p-2 border rounded-lg w-full"
          >
            <h1>
              {fund.target <= fund.balance
                ? "Withdraw balance"
                : "Add an installment"}
            </h1>
            <CustomDropdown
              title="Select need or want"
              options={["NEED", "WANT"]}
              selection={selection}
              setSelection={setSelection}
            />
            <Button type="submit">
              {fund.target <= fund.balance ? "Withdraw" : "Add"}
            </Button>
          </form>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FundCard;
