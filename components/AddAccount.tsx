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
import { accountApiService } from "@/services/apiService";

export function AddAccount({ userId }: { userId: string }) {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const formSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newAccount = await accountApiService.addAccount(userId);
    console.log(newAccount);
    setOpen(false);
  };

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">Add Account</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Account</DialogTitle>
            <DialogDescription>
              Add your account here and keep track of your expenses.
            </DialogDescription>
          </DialogHeader>
          <ProfileForm userId={userId} formSubmit={formSubmit} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline">Add Account</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Add Account</DrawerTitle>
          <DrawerDescription>
            Add your account here and keep track of your expenses.
          </DrawerDescription>
        </DrawerHeader>
        <ProfileForm className="px-4" userId={userId} formSubmit={formSubmit} />
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
  return (
    <form
      onSubmit={formSubmit}
      className={cn("grid items-start gap-4", className)}
    >
      <div className="grid gap-2">
        <Label htmlFor="userId">User ID</Label>
        <Input type="text" id="userId" defaultValue={userId} disabled={true} />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="pri_balance">Primary Balance</Label>
        <Input
          startIcon={IndianRupee}
          id="pri_balance"
          defaultValue="0"
          disabled
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="sec_balance">Secondary Balance</Label>
        <Input
          startIcon={IndianRupee}
          id="sec_balance"
          defaultValue="0"
          disabled
        />
      </div>
      <DialogBox
        title="Info"
        description="Initializing balance will be enabled later. To initialize balance just add a transaction once your account is added."
      />
      <Button type="submit">Add</Button>
    </form>
  );
}
