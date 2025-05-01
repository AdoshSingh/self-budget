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
import { FundRequest } from "@/domain/requestTypes";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { fundApiService } from "@/clients/api/fundService";
import { useAccountStore } from "@/store/accountStore";
import { useFundStore } from "@/store/fundStore";

export function AddFund() {
  const { toast } = useToast();

  const account = useAccountStore((state) => state.account);
  const addFundInStore = useFundStore((state) => state.addFund);

  const [open, setOpen] = useState(false);

  const addFund = async (
    e: React.FormEvent<HTMLFormElement>,
    args: Omit<FundRequest, "accountId">
  ) => {
    e.preventDefault();
    if (!account) return;
    if (
      args.title === "" ||
      args.duration === 0 ||
      args.installment === 0 ||
      args.target === 0
    ) {
      toast({
        variant: "destructive",
        title: "Invalid inputs",
        description: "Please fill all the inputs before adding a transaction",
      });
      return;
    }

    const response = await fundApiService.createFund({...args, accountId: account.id});

    if(!response || response.status >= 400 || !response.data) {
      toast({
        variant: "destructive",
        description: response.message || "Something went wrong",
      });
      return;
    }
    addFundInStore(response.data);
    toast({ description: "Fund created successfully" });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Make a Fund</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Make a Fund</DialogTitle>
          <DialogDescription>Create a fund mate</DialogDescription>
        </DialogHeader>
        <Card className="p-4 bg-slate-100">
          <AddFundForm formSubmit={addFund} />
        </Card>
      </DialogContent>
    </Dialog>
  );
}

interface AddFundFormProps extends React.ComponentProps<"form"> {
  formSubmit: (
    e: React.FormEvent<HTMLFormElement>,
    args: Omit<FundRequest, "accountId">
  ) => void;
}

function AddFundForm({ className, formSubmit }: AddFundFormProps) {
  const [title, setTitle] = useState<FundRequest["title"]>("");
  const [target, setTarget] = useState<FundRequest["target"]>(0);
  const [installment, setInstallment] = useState<FundRequest["installment"]>(0);
  const [duration, setDuration] = useState<FundRequest["duration"]>(0);

  useEffect(() => {
    if(duration === 0 || target === 0) return;
    const newInstallment = target / duration;
    setInstallment(newInstallment);
  }, [duration, target]);

  return (
    <form
      onSubmit={(e) => {
        formSubmit(e, { title, target, installment, duration });
      }}
      className={cn("grid items-start gap-4", className)}
    >
      <div className="flex flex-col gap-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          placeholder="Enter Title"
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="target">Target</Label>
        <Input
          id="target"
          type="number"
          step="any"
          placeholder="Enter the final amount"
          onChange={(e) => setTarget(Number(e.target.value))}
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="installment">Installment</Label>
        <Input
          id="installment"
          type="number"
          step="any"
          disabled
          value={installment}
          placeholder="Enter installment"
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="duration">Duration</Label>
        <Input
          id="duration"
          placeholder="Enter duration"
          type="number"
          onChange={(e) => setDuration(Number(e.target.value))}
        />
      </div>
      <Button type="submit">Create</Button>
    </form>
  );
}
