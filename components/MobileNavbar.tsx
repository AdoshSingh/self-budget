"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import SidebarNavigator from "./SidebarNavigator";

export function MobileNavbar() {
  return (
    <div className="grid grid-cols-2 gap-2">
      <Sheet key={"left"}>
        <SheetTrigger asChild>
          <Menu className=" cursor-pointer"/>
        </SheetTrigger>
        <SheetContent side={"left"}>
          <SheetHeader>
            <SheetTitle>X_BUDGET</SheetTitle>
            <SheetDescription>
            </SheetDescription>
          </SheetHeader>
          <SidebarNavigator/>
        </SheetContent>
      </Sheet>
    </div>
  );
}
