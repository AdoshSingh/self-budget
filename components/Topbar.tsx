import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ProfileDropDown from "@/components/ProfileDropDown";
import Image from "next/image";
import Link from "next/link";

export default async function Topbar() {
  const session = await getServerSession(authOptions);
  return (
    <div className="w-full flex justify-between bg-slate-100 px-6 py-4 items-center border-b">
      <h1 className=" font-bold text-2xl">X_BUDGET</h1>
      {!session ? (
        <Link href={"/signin"}>
          <div className="btn btn-primary">Sign in</div>
        </Link>
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger className=" flex items-center gap-4 bg-white py-2 border rounded-xl px-3">
            <h1 className="text-md font-semibold">{session.user.name}</h1>
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
      )}
    </div>
  );
}
