"use client";

import { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "./ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
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
  const isDesktop = useMediaQuery("(min-width: 768px)");

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
    console.log(resp);
    setAccount(session.user.id);
    setOpen(false);
    toast({ description: "Transaction added successfully" });
  };

  const formContainerRef = useRef<HTMLDivElement | null>(null);

  const [viewportHeight, setViewportHeight] = useState(
    window.visualViewport?.height
  );

  useEffect(() => {
    function updateViewportHeight() {
      setViewportHeight(window.visualViewport?.height || 0);
    }

    window.visualViewport?.addEventListener("resize", updateViewportHeight);
    return () =>
      window.visualViewport?.removeEventListener(
        "resize",
        updateViewportHeight
      );
  }, []);

  if (isDesktop) {
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
                <ProfileForm formSubmit={addTransaction} />
              </Card>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <ScrollArea
      style={{
        height: `${window.innerHeight > (viewportHeight || 0) ? 20 : 100}%`,
      }}
    >
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button variant="outline">Add Transaction</Button>
        </DrawerTrigger>
        <DrawerContent ref={formContainerRef}>
          <DrawerHeader className="text-left">
            <DrawerTitle>Add Transaction</DrawerTitle>
            <DrawerDescription>Add your transactions here.</DrawerDescription>
          </DrawerHeader>
          <Tabs defaultValue="transaction" className="mx-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="transaction">Transaction</TabsTrigger>
              <TabsTrigger value="transfer">Transfer</TabsTrigger>
            </TabsList>
            <TabsContent value="transaction">
              <Card className="p-4">
                <ProfileForm formSubmit={addTransaction} />
              </Card>
            </TabsContent>
            <TabsContent value="transfer">
              <Card className="p-4">
                <ProfileForm formSubmit={addTransaction} />
              </Card>
            </TabsContent>
          </Tabs>
          <DrawerFooter className="pt-2">
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </ScrollArea>
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
