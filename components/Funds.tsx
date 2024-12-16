"use client";
import { useAppStore } from "@/store/store";
import { AddFund } from "./AddFund";
import { convertToCurrency } from "@/utils/formatNumber";
import { ChevronRightIcon } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { CustomDropdown } from "./CustomDropdown";
import { useState } from "react";
import { TransactionRequest } from "@/domain/requestTypes";
import { useToast } from "./ui/use-toast";
import { fundApiService, transactionApiService } from "@/services/apiService";

const Funds = () => {
  const { toast } = useToast();
  const { account, setAccount, session, setFunds } = useAppStore();
  const [selection, setSelection] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);

  const addInstallment = async (
    e: React.FormEvent<HTMLFormElement>,
    args: Omit<TransactionRequest, "accountId">,
    fundId: string
  ) => {
    e.preventDefault();
    if (!session || !account) return;
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

    switch (args.payer) {
      case "NEED":
        if (args.amount > account.need) {
          toast({
            variant: "destructive",
            title: "Insufficient balance",
            description:
              "Your needs dont have enough amount.",
          });
          return;
        }
        break;
      case "WANT":
        if (args.amount > account.want) {
          toast({
            variant: "destructive",
            title: "Insufficient balance",
            description:
              "Your wants dont have enough amount.",
          });
          return;
        }
        break;
    }

    const resp = await transactionApiService.addTransaction({
      ...args,
      accountId: account.id,
      fundId,
    });
    setAccount(session.user.id);
    setOpen(false);
    setFunds(account.id, null);
    toast({ description: "Installment added successfully" });
  };

  const withdrawAmount = async (
    e: React.FormEvent<HTMLFormElement>,
    args: Omit<TransactionRequest, "accountId">,
    fundId: string
  ) => {
    e.preventDefault();
    if (!session || !account) return;
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

    const resp = await transactionApiService.addTransaction({
      ...args,
      accountId: account.id,
      fundId,
    });

    const resp2 = await fundApiService.deleteFund(fundId);
    setAccount(session.user.id);
    setOpen(false);
    setFunds(account.id, null);
    toast({ description: "Withdrawn money successfully" });
  }

  const { funds } = useAppStore();
  return (
    <div className="flex-1 p-6 h-full overflow-auto">
      <div className="flex justify-between items-center mb-4">
        <span className="text-2xl">Your Funds</span>
        <AddFund />
      </div>
      {funds?.map((ele, id) => (
        <Dialog key={id}>
          <div
            className={` border border-gray-300 p-3 w-full rounded-lg ${
              id !== funds.length - 1 && "mb-4"
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-1">
                  <span className="font-bold text-xl">{ele.title}</span>
                </div>
                <div className="flex text-sm text-gray-500 items-center gap-1">
                  <h1 className="">Target:</h1>
                  <span>{convertToCurrency(ele.target)}</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className=" text-xl ">
                  {convertToCurrency(ele.balance)}
                </div>
                <DialogTrigger asChild>
                  <ChevronRightIcon className=" scale-75 cursor-pointer rounded-full hover:bg-slate-300 transition-all" />
                </DialogTrigger>
              </div>
            </div>
          </div>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{ele.title}</DialogTitle>
              <DialogDescription></DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 p-2 border rounded-lg ">
              <div className="flex justify-between items-center gap-4">
                <h1 className="text-gray-500">Target</h1>
                <span>{convertToCurrency(ele.target)}</span>
              </div>
              <div className="flex justify-between items-center gap-4">
                <h1 className="text-gray-500">Installment</h1>
                <span>{convertToCurrency(ele.installment)}</span>
              </div>
              <div className="flex justify-between items-center gap-4">
                <h1 className="text-gray-500">Duration</h1>
                <span>{ele.duration + " months"}</span>
              </div>
              <Separator />
              <div className="flex justify-between items-center gap-4">
                <h1 className="text-gray-500">Balance</h1>
                <span>{convertToCurrency(ele.balance)}</span>
              </div>
            </div>
            <DialogFooter>
              <form
                onSubmit={(e) => {
                  if(ele.target > ele.balance) {
                    addInstallment(
                      e,
                      {
                        type: "TRANSFER",
                        date: new Date(),
                        payee: `Fund: ${ele.title}`,
                        payer: selection,
                        bracket: "FUND_TRANSFER",
                        amount: ele.installment,
                      },
                      ele.id
                    );
                  } else {
                    withdrawAmount(
                      e,
                      {
                        type: "DEBIT",
                        date: new Date(),
                        payee: selection,
                        payer: `Fund: ${ele.title}`,
                        bracket: "FUND_DEBIT",
                        amount: ele.balance,
                      },
                      ele.id
                    )
                  }
                }}
                className="grid gap-4 p-2 border rounded-lg w-full"
              >
                <h1>{ele.target <= ele.balance ? "Withdraw balance" :  "Add an installment"}</h1>
                <CustomDropdown
                  title="Select need or want"
                  options={["NEED", "WANT"]}
                  selection={selection}
                  setSelection={setSelection}
                />
                <DialogTrigger asChild>
                  <Button type="submit">{ele.target <= ele.balance ? "Withdraw" :  "Add"}</Button>
                </DialogTrigger>
              </form>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      ))}
    </div>
  );
};

export default Funds;
