import SidebarNavigator from "./SidebarNavigator";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const Sidebar = async () => {
  const session = await getServerSession(authOptions);

  if (!session) return;
  return (
    <div className="w-[15rem] bg-slate-100 border-r p-4 hidden md:block">
      <SidebarNavigator/>
    </div>
  );
};

export default Sidebar;
