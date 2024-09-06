"use client";

import { usePathname } from "next/navigation";
import { sidebarElements } from "@/constants/constant";
import SidebarElement from "./SidebarElement";

const SidebarNavigator = () => {
  const pathName = usePathname();
  return (
    <div className="flex flex-col gap-1">
      {sidebarElements.map((ele, ind) => (
        <SidebarElement
          route={ele.route}
          content={ele.key}
          key={ind}
          Icon={ele.icon}
          active={pathName === ele.route}
        />
      ))}
    </div>
  );
};

export default SidebarNavigator;
