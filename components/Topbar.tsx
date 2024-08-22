import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ProfileDropDown from "@/components/ProfileDropDown";
import Image from "next/image";

export default async function Topbar() {
  const session = await getServerSession(authOptions);
  console.log(session?.user.image);

  return (
    <div className="bg-blue-300 w-full">
      <div>
        {session?.user ? (
          <div>
            <h1> {session.user.name}</h1>
            {session.user && (
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Image
                    src={`${session.user.image}`}
                    width={40}
                    height={40}
                    className=" rounded-full"
                    alt={session.user.name[0]}
                  />
                </DropdownMenuTrigger>
                <ProfileDropDown />
              </DropdownMenu>
            )}
          </div>
        ) : (
          <a className="btn btn-primary" href="/api/auth/signin">
            Sign in
          </a>
        )}
      </div>
    </div>
  );
}
