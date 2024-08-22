"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Button } from "@/components/ui/button";
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
import { IndianRupee } from "lucide-react";
import { DialogBox } from "./DialogBox";
import { useAppStore } from "@/store/store";
import { CustomDropdown } from "./CustomDropdown";
import {
  transactionOptions,
  trasactionTypesOptions,
} from "@/constants/constant";
import { DatePickerDemo } from "./DatePicker";

export function AddTransaction() {
  const { account } = useAppStore();
  const [open, setOpen] = useState(false);
  // const [userId, setUserId] = useState(session?.user.id);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const formSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">Add Transaction</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Transaction</DialogTitle>
            <DialogDescription>Add your transactions here.</DialogDescription>
          </DialogHeader>
          <ProfileForm userId={account?.id} formSubmit={formSubmit} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline">Add Transaction</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Add Transaction</DrawerTitle>
          <DrawerDescription>Add your transactions here.</DrawerDescription>
        </DrawerHeader>
        <ProfileForm
          className="px-4"
          userId={account?.id}
          formSubmit={formSubmit}
        />
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

interface ProfileFormProps extends React.ComponentProps<"form"> {
  userId?: string;
  formSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
}

function ProfileForm({ className, userId, formSubmit }: ProfileFormProps) {
  const [transactionType, setTransactionType] = useState<string>("");
  const [bracketType, setBracketType] = useState<string>("");
  const [transactionDate, setTransactionDate] = useState<Date>();
  const [payee, setPayee] = useState("");
  const [payer, setPayer] = useState("");
  const [fundId, setFundId] = useState("");

  return (
    <form
      onSubmit={formSubmit}
      className={cn("grid items-start gap-4", className)}
    >
      <div className="grid gap-2">
        <Label htmlFor="transaction-type">Transaction Type</Label>
        <CustomDropdown
          title="Select transaction type"
          options={Object.keys(transactionOptions)}
          selection={transactionType}
          setSelection={setTransactionType}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="bracket-type">Bracket Type</Label>
        <CustomDropdown
          title="Select bracket type"
          options={
            transactionType === ""
              ? []
              : transactionOptions[
                  transactionType as "CREDIT" | "DEBIT" | "TRANSFER"
                ]
          }
          selection={bracketType}
          setSelection={setBracketType}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="date">Date</Label>
        <DatePickerDemo date={transactionDate} setDate={setTransactionDate} />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="payee">Payee</Label>
        <Input
          id="payee"
          placeholder="Enter payee name"
          onChange={(e) => setPayee(e.target.value)}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="payer">Payer</Label>
        <Input
          id="payer"
          placeholder="Enter payer name"
          onChange={(e) => setPayer(e.target.value)}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="fundId">Fund ID</Label>
        <Input
          id="fundId"
          placeholder="Enter fund ID"
          onChange={(e) => setFundId(e.target.value)}
        />
      </div>
      <Button type="submit">Add</Button>
    </form>
  );
}
