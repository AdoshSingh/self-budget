"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppStore } from "@/store/store";
import { CustomDropdown } from "./CustomDropdown";
import { transactionOptions } from "@/constants/constant";
import { DatePickerDemo } from "./DatePicker";
import { TransactionRequest } from "@/domain/requestTypes";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { transactionApiService } from "@/services/apiService";
import { useToast } from "@/components/ui/use-toast";

export function AddTransaction() {
  const { toast } = useToast();
  const { account, setAccount, session } = useAppStore();
  const [open, setOpen] = useState(false);

  const addTransaction = async (
    e: React.FormEvent<HTMLFormElement>,
    args: Omit<TransactionRequest, "accountId">
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

    if (args.type === "DEBIT") {
      switch (args.bracket) {
        case "NEED":
          if (args.amount > account.need) {
            toast({
              variant: "destructive",
              title: "Insufficient balance",
              description:
                "Your needs dont have enough amount please make a transfer first.",
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
                "Your wants dont have enough amount please make a transfer first.",
            });
            return;
          }
          break;
        case "INVEST":
          if (args.amount > account.investment) {
            toast({
              variant: "destructive",
              title: "Insufficient balance",
              description:
                "Your investment dont have enough amount please make a transfer first.",
            });
            return;
          }
          break;
      }
    }

    const resp = await transactionApiService.addTransaction({
      ...args,
      accountId: account.id,
    });
    setAccount(session.user.id);
    setOpen(false);
    toast({ description: "Transaction added successfully" });
  };

  // const addTransfer = async (
  //   e: React.FormEvent<HTMLFormElement>,
  //   args: Omit<TransactionRequest, "accountId">
  // ) => {
  //   e.preventDefault();
  //   if(!session || !account) return;
    
  // };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Add Transaction</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <Tabs defaultValue="transaction">
          <DialogHeader>
            <DialogTitle>Add Transaction</DialogTitle>
            <DialogDescription>Add your transactions here.</DialogDescription>
          </DialogHeader>
          <TabsList className="grid w-full grid-cols-2 my-4">
            <TabsTrigger value="transaction">Transaction</TabsTrigger>
            <TabsTrigger value="transfer">Transfer</TabsTrigger>
          </TabsList>
          <TabsContent value="transaction">
            <Card className="p-4 bg-slate-100">
              <ProfileForm formSubmit={addTransaction} />
            </Card>
          </TabsContent>
          <TabsContent value="transfer">
            <Card className="p-4">
              <TransferForm formSubmit={addTransaction} balance={account?.primary_balance}/>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

interface ProfileFormProps extends React.ComponentProps<"form"> {
  formSubmit: (
    e: React.FormEvent<HTMLFormElement>,
    args: Omit<TransactionRequest, "accountId">
  ) => void;
}

function ProfileForm({ className, formSubmit }: ProfileFormProps) {
  const [type, setType] = useState<TransactionRequest["type"]>("");
  const [date, setDate] = useState<TransactionRequest["date"]>();
  const [payee, setPayee] = useState<TransactionRequest["payee"]>("");
  const [payer, setPayer] = useState<TransactionRequest["payer"]>("");
  const [bracket, setBracket] = useState<TransactionRequest["bracket"]>("");
  const [amount, setAmount] = useState<TransactionRequest["amount"]>(0);

  useEffect(() => {
    switch (bracket) {
      case "INCOME":
        setPayee("Primary");
        setPayer("");
        break;
      case "UNREGULATED":
        setPayee("Secondary");
        setPayer("");
        break;
      case "REFUND":
        setPayee("");
        setPayer("");
        break;
      case "NEED":
        setPayer("Need");
        setPayee("");
        break;
      case "WANT":
        setPayer("Want");
        setPayee("");
        break;
      case "INVEST":
        setPayer("Investments");
        setPayee("");
        break;
      case "":
        setPayee("");
        setPayer("");
        break;
    }
  }, [bracket]);

  useEffect(() => {
    if (bracket !== "") {
      setBracket("");
    }
  }, [type]);

  return (
    <form
      onSubmit={(e) => {
        formSubmit(e, {
          type,
          date: date ? date : new Date(),
          payee,
          payer,
          bracket,
          amount,
        });
      }}
      className={cn("grid items-start gap-4", className)}
    >
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="transaction-type">Transaction Type</Label>
            <CustomDropdown
              title="Select transaction type"
              options={Object.keys(transactionOptions).filter(
                (ele) => ele !== "TRANSFER"
              )}
              selection={type}
              setSelection={setType}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="bracket-type">Bracket Type</Label>
            <CustomDropdown
              title="Select bracket type"
              options={
                type === ""
                  ? []
                  : transactionOptions[type as "CREDIT" | "DEBIT" | "TRANSFER"]
              }
              selection={bracket}
              setSelection={setBracket}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="date">Date</Label>
            <DatePickerDemo date={date} setDate={setDate} />
          </div>
        </div>

        <div className="flex-1 space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              placeholder="Enter amount"
              type="number"
              step="any"
              onChange={(e) => setAmount(Number(e.target.value))}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="payee">Payee</Label>
            <Input
              id="payee"
              value={payee}
              disabled={bracket === "INCOME" || bracket === "UNREGULATED"}
              placeholder="Enter payee name"
              onChange={(e) => setPayee(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="payer">Payer</Label>
            <Input
              id="payer"
              value={payer}
              disabled={
                bracket === "NEED" || bracket === "WANT" || bracket === "INVEST"
              }
              placeholder="Enter payer name"
              onChange={(e) => setPayer(e.target.value)}
            />
          </div>
        </div>
      </div>
      <Button type="submit">Add</Button>
    </form>
  );
}

interface TransferFormProps extends React.ComponentProps<"form"> {
  formSubmit: (
    e: React.FormEvent<HTMLFormElement>,
    args: Omit<TransactionRequest, "accountId">,
  ) => void;
  balance?: number;
}

function TransferForm({ className, formSubmit, balance }: TransferFormProps) {
  const [date, setDate] = useState<TransactionRequest["date"]>();
  const [payee, setPayee] = useState<TransactionRequest["payee"]>("");
  const [payer, setPayer] = useState<TransactionRequest["payer"]>("");
  const [bracket, setBracket] = useState<TransactionRequest["bracket"]>("");
  const [amount, setAmount] = useState<TransactionRequest["amount"]>(0);

  useEffect(() => {
    if(bracket === "SURPLUS" && balance) {
      setAmount(balance);
      setPayee("Secondary");
      setPayer("Primary");
    }
  }, [bracket]);

  return (
    <form
      onSubmit={(e) => {
        formSubmit(e, {
          type: "TRANSFER",
          date: date ? date : new Date(),
          payee,
          payer,
          bracket,
          amount,
        });
      }}
      className={cn("grid items-start gap-4", className)}
    >
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="transaction-type">Transaction Type</Label>
            <Input
              id="amount"
              placeholder="Enter amount"
              type="text"
              disabled
              value={"TRANSFER"}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="bracket-type">Bracket Type</Label>
            <CustomDropdown
              title="Select bracket type"
              options={transactionOptions["TRANSFER"].filter(
                (ele) => ele !== "FUND_TRANSFER" && ele !== "PENALTY"
              )}
              selection={bracket}
              setSelection={setBracket}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="date">Date</Label>
            <DatePickerDemo date={date} setDate={setDate} />
          </div>
        </div>

        <div className="flex-1 space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              placeholder="Enter amount"
              type="number"
              step="any"
              value={amount === 0 ? "" : amount}
              disabled={bracket === "SURPLUS"}
              onChange={(e) => setAmount(Number(e.target.value))}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="payee">Payee</Label>
            <Input
              id="payee"
              value={payee}
              disabled={bracket === "SURPLUS"}
              placeholder="Enter payee name"
              onChange={(e) => setPayee(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="payer">Payer</Label>
            <Input
              id="payer"
              value={payer}
              disabled={bracket === "SURPLUS"}
              placeholder="Enter payer name"
              onChange={(e) => setPayer(e.target.value)}
            />
          </div>
        </div>
      </div>
      <Button type="submit">Add</Button>
    </form>
  );
}
