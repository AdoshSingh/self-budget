import SidebarNavigator from "./SidebarNavigator";

const Sidebar = async () => {
  return (
    <div className="w-[15rem] bg-slate-100 border-r p-4 hidden md:block">
      <SidebarNavigator/>
    </div>
  );
};

export default Sidebar;
