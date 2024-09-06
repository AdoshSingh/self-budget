import Link from "next/link";
import { type LucideIcon } from "lucide-react";

const SidebarElement = ({
  route,
  Icon,
  content,
  active
}: {
  route: string;
  Icon: LucideIcon;
  content: string;
  active: boolean
}) => {
  return (
    <Link href={route} className={`flex items-center w-full ${active ? "bg-slate-900 text-white" : "hover:bg-slate-200 text-black"} rounded-md p-1 gap-2 pl-4`}>
      <Icon className="w-4"/>
      <h1 className=" capitalize">{content}</h1>
    </Link>
  );
};

export default SidebarElement;
