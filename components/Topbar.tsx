import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ProfileDropDown from "@/components/ProfileDropDown";

export default async function Topbar() {
  const session = await getServerSession(authOptions);

  return (
    <div className="bg-blue-300 w-full">
      <div>
        {session?.user ? (
          <div>
            <h1> {session.user.name}</h1>
            {session.user.image && (
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Avatar>
                    <AvatarImage src={session.user.image} />
                    <AvatarFallback>AN</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <ProfileDropDown/>
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
