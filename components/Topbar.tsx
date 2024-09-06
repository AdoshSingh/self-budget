import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ProfileDropDown from "@/components/ProfileDropDown";
import Image from "next/image";
import { MobileNavbar } from "./MobileNavbar";

export default async function Topbar() {
  const session = await getServerSession(authOptions);

  if (!session) return;

  return (
    <div className=" h-[10vh] w-full bg-slate-100 px-4 border-b sticky">
      <div className="hidden md:flex justify-between items-center h-full">
        <h1 className=" font-bold text-2xl">X_BUDGET</h1>
        <DropdownMenu>
          <DropdownMenuTrigger className="">
            <Image
              src={`${session.user.image}`}
              width={34}
              height={34}
              className=" rounded-full"
              alt={session.user.name[0]}
            />
          </DropdownMenuTrigger>
          <ProfileDropDown />
        </DropdownMenu>
      </div>
      <div className="md:hidden flex justify-between items-center h-full">
        <MobileNavbar/>
        <h1 className=" font-bold text-2xl">X_BUDGET</h1>
        <DropdownMenu>
          <DropdownMenuTrigger className="">
            <Image
              src={`${session.user.image}`}
              width={34}
              height={34}
              className=" rounded-full"
              alt={session.user.name[0]}
            />
          </DropdownMenuTrigger>
          <ProfileDropDown />
        </DropdownMenu>
      </div>
    </div>
  );
}
