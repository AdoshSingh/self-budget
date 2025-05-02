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
import { useTransactionStore } from "@/store/transactionStore";
import { useAccountStore } from "@/store/accountStore";
import { CustomDropdown } from "./CustomDropdown";
import { transactionOptions } from "@/constants/constant";
import { DatePickerDemo } from "./DatePicker";
import { TransactionRequest } from "@/domain/requestTypes";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { transactionApiService } from "@/clients/api/transactionService";
import { useToast } from "@/components/ui/use-toast";
import * as React from "react";



export const AddTransaction = React.memo(function AddTransaction() {
  const [open, setOpen] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const { account } = useAccountStore((state) => ({
    account: state.account,
  }));

  const addTransactionInState = useTransactionStore(state => state.addTransaction);
  
  const { toast } = useToast();

  const addTransaction = async (
    e: React.FormEvent<HTMLFormElement>,
    args: Omit<TransactionRequest, "accountId">
  ) => {
    e.preventDefault();
    if(formSubmitted) return;
    setFormSubmitted(true);

    if(!account) {
      toast({
        variant: "destructive",
        title: "Something went wrong",
        description: "Please try again",
      });
      setFormSubmitted(false);
      return;
    }

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
      setFormSubmitted(false);
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
            setFormSubmitted(false);
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
            setFormSubmitted(false);
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
            setFormSubmitted(false);
            return;
          }
          break;
      }
    }

    const response = await transactionApiService.addTransaction({
      ...args,
      accountId: account.id,
    });
    if (!response || response.status >= 400) {
      toast({
        variant: "destructive",
        description: response.message || "Something went wrong",
      });
      setFormSubmitted(false);
      return;
    }

    const transaction = response.data;
    if (!transaction) {
      toast({
        variant: "destructive",
        title: "Something went wrong",
        description: "Please try again",
      });
      setFormSubmitted(false);
      return;
    }

    switch (transaction.type) {
      case "CREDIT":{
        if(transaction.bracket === "INCOME") {
          useAccountStore.setState((state) => {
            if (!state.account) return {};
          
            return {
              account: {
                ...state.account,
                primary_balance: state.account.primary_balance + transaction.amount,
                need: state.account.need + ((transaction.amount * 50) / 100),
                want: state.account.want + ((transaction.amount * 30) / 100),
                investment: state.account.investment + ((transaction.amount * 20) / 100),
                total_balance: state.account.total_balance + transaction.amount,
              },
            };
          });
        } else if(transaction.bracket === "UNREGULATED") {
          useAccountStore.setState((state) => {
            if (!state.account) return {};
          
            return {
              account: {
                ...state.account,
                secondary_balance: state.account.secondary_balance + transaction.amount,
                total_balance: state.account.total_balance + transaction.amount,
              },
            };
          });
        } else if(transaction.bracket === "REFUND") {
          const payeeToField: Record<
            string,
            keyof Pick<typeof account, "need" | "want" | "investment">
          > = {
            NEED: "need",
            WANT: "want",
            INVEST: "investment",
          };
  
          const updatedField = payeeToField[transaction.payee];

          useAccountStore.setState((state) => {
            if (!state.account) return {};
          
            return {
              account: {
                ...state.account,
                primary_balance: state.account.primary_balance + transaction.amount,
                [updatedField]: state.account[updatedField] + transaction.amount,
                total_balance: state.account.total_balance + transaction.amount,
              },
            };
          });
        }
      } break;

      case "DEBIT": {
        const brackets: Record<
          string, 
          keyof Pick<typeof account, "need" | "want" | "investment">
        > = {
          NEED: "need",
          WANT: "want",
          INVEST: "investment",
        };
    
        const bracketKey = brackets[transaction.bracket];

        useAccountStore.setState((state) => {
          if (!state.account) return {};
        
          return {
            account: {
              ...state.account,
              primary_balance: state.account.primary_balance - transaction.amount,
              [bracketKey]: state.account[bracketKey] - transaction.amount,
              total_balance: state.account.total_balance - transaction.amount,
            },
          };
        });
      } break;

      case "TRANSFER": {
        if(transaction.bracket === "SURPLUS") {
          useAccountStore.setState((state) => {
            if (!state.account) return {};
          
            return {
              account: {
                ...state.account,
                primary_balance: 0,
                need: 0,
                want: 0,
                investment: 0,
                secondary_balance: state.account.secondary_balance + transaction.amount,
              },
            };
          });
        } else if (transaction.bracket === "INTERNAL") {
          const payeeField: Record<string, keyof Pick<typeof account, "need" | "want" | "investment">> = {
            NEED: "need",
            WANT: "want",
            INVEST: "investment",
          };
          const payeeKey = payeeField[transaction.payee];

          const payerFeild: Record<
            string,
            keyof Pick<
                typeof account,
                "need" | "want" | "investment" | "secondary_balance"
              >
            | "fund"
          > = {
            NEED: "need",
            WANT: "want",
            INVEST: "investment",
            SECONDARY: "secondary_balance",
            FUND: "fund"
          };

          const payee = transaction.payee;
          const newPayerFeild = Object.fromEntries(
            Object.entries(payerFeild).filter(([ele]) => ele !== payee)
          );

          const newPayerKey = newPayerFeild[transaction.payer];
          if(newPayerKey === "secondary_balance") {
            useAccountStore.setState((state) => {
              if (!state.account) return {};
          
              return {
                account: {
                  ...state.account,
                  primary_balance: state.account.primary_balance + transaction.amount,
                  [payeeKey]: state.account[payeeKey] + transaction.amount,
                  [newPayerKey]: state.account[newPayerKey] - transaction.amount,
                },
              };
            });
          } else {
            if(!newPayerKey || newPayerKey === 'fund') {
              toast({
                variant: "destructive",
                title: "Something went wrong",
                description: "Please try again",
              });
              return;
            }
            useAccountStore.setState((state) => {
              if (!state.account) return {};
          
              return {
                account: {
                  ...state.account,
                  [payeeKey]: state.account[payeeKey] + transaction.amount,
                  [newPayerKey]: state.account[newPayerKey] - transaction.amount,
                },
              };
            });
          }
        }
      }
    }
    addTransactionInState(transaction);
    toast({ description: "Transaction added successfully" });
    setFormSubmitted(false);
    setOpen(false);
  };

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
              <TransactionForm formSubmit={addTransaction} formDisabled={formSubmitted}/>
            </Card>
          </TabsContent>
          <TabsContent value="transfer">
            <Card className="p-4">
              <TransferForm formSubmit={addTransaction} balance={account?.primary_balance} formDisabled={formSubmitted}/>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
});

interface TransactionFormProps extends React.ComponentProps<"form"> {
  formSubmit: (
    e: React.FormEvent<HTMLFormElement>,
    args: Omit<TransactionRequest, "accountId">
  ) => void;
  formDisabled: boolean;
}

function TransactionForm({ className, formSubmit, formDisabled }: TransactionFormProps) {
  const [type, setType] = useState<TransactionRequest["type"]>("");
  const [date, setDate] = useState<TransactionRequest["date"]>();
  const [payee, setPayee] = useState<TransactionRequest["payee"]>("");
  const [payer, setPayer] = useState<TransactionRequest["payer"]>("");
  const [bracket, setBracket] = useState<TransactionRequest["bracket"]>("");
  const [amount, setAmount] = useState<TransactionRequest["amount"]>(0);
  const [refundPayee, setRefundPayee] = useState<boolean>(false);

  useEffect(() => {
    switch (bracket) {
      case "INCOME":
        setPayee("Primary");
        setPayer("");
        setRefundPayee(false);
        break;
      case "UNREGULATED":
        setPayee("Secondary");
        setPayer("");
        setRefundPayee(false);
        break;
      case "REFUND":
        setPayee("");
        setPayer("");
        setRefundPayee(true);
        break;
      case "NEED":
        setPayer("Need");
        setPayee("");
        setRefundPayee(false);
        break;
      case "WANT":
        setPayer("Want");
        setPayee("");
        setRefundPayee(false);
        break;
      case "INVEST":
        setPayer("Investments");
        setPayee("");
        setRefundPayee(false);
        break;
      case "":
        setPayee("");
        setPayer("");
        setRefundPayee(false);
        break;
    }
  }, [bracket]);

  useEffect(() => {
    if (bracket !== "") {
      setBracket("");
      setRefundPayee(false);
    }
  }, [type]);

  return (
    <form
      onSubmit={(e) => {
        formSubmit(e, {
          type,
          date: date ? date : new Date(),
          payee: payee.trim(),
          payer: payer.trim(),
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
            {refundPayee ? 
              (
                <CustomDropdown
                  title="Select payee"
                  options={transactionOptions.DEBIT}
                  selection={payee}
                  setSelection={setPayee}
                />
              ) 
              :
              (
                <Input
                  id="payee"
                  value={payee}
                  disabled={bracket === "INCOME" || bracket === "UNREGULATED"}
                  placeholder="Enter payee name"
                  onChange={(e) => setPayee(e.target.value)}
                /> 
              )
            }
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
      <Button type="submit" disabled={formDisabled}>Add</Button>
    </form>
  );
}

interface TransferFormProps extends React.ComponentProps<"form"> {
  formSubmit: (
    e: React.FormEvent<HTMLFormElement>,
    args: Omit<TransactionRequest, "accountId">,
  ) => void;
  balance?: number;
  formDisabled?: boolean;
}

function TransferForm({ className, formSubmit, balance, formDisabled }: TransferFormProps) {
  const [date, setDate] = useState<TransactionRequest["date"]>();
  const [payee, setPayee] = useState<TransactionRequest["payee"]>("");
  const [payer, setPayer] = useState<TransactionRequest["payer"]>("");
  const [bracket, setBracket] = useState<TransactionRequest["bracket"]>("");
  const [amount, setAmount] = useState<TransactionRequest["amount"]>(0);
  const [internalTransfer, setInternalTransfer] = useState<boolean>(false);

  useEffect(() => {
    if(bracket === "SURPLUS" && balance) {
      setAmount(balance);
      setPayee("Secondary");
      setPayer("Primary");
      setInternalTransfer(false);
    } else if (bracket === "INTERNAL") {
      setAmount(0);
      setPayee("");
      setPayer("");
      setInternalTransfer(true);
    }
  }, [bracket]);

  return (
    <form
      onSubmit={(e) => {
        formSubmit(e, {
          type: "TRANSFER",
          date: date ? date : new Date(),
          payee: payee.trim(),
          payer: payer.trim(),
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
            {internalTransfer ?
              <CustomDropdown
                title="Select payee"
                options={transactionOptions["DEBIT"]}
                selection={payee}
                setSelection={setPayee}
                disabled={payer}
              />
              :
              <Input
                id="payee"
                value={payee}
                disabled={bracket === "SURPLUS"}
                placeholder="Enter payee name"
                onChange={(e) => setPayee(e.target.value)}
              />
            }
          </div>
          <div className="grid gap-2">
            <Label htmlFor="payer">Payer</Label>
            {internalTransfer ?
              <CustomDropdown
                title="Select payer"
                options={[...transactionOptions["DEBIT"], "SECONDARY"]}
                selection={payer}
                setSelection={setPayer}
                disabled={payee}
              />
              :
              <Input
                id="payer"
                value={payer}
                disabled={bracket === "SURPLUS"}
                placeholder="Enter payer name"
                onChange={(e) => setPayer(e.target.value)}
              />
            }
          </div>
        </div>
      </div>
      <Button type="submit" disabled={formDisabled}>Add</Button>
    </form>
  );
}
