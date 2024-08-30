import { Skeleton } from "@/components/ui/skeleton";

export const AccountSkeleton = () => {
  return (
    <div className="p-6 flex flex-col gap-4">
      <Skeleton className="w-[16rem] h-[3.5rem] rounded-lg bg-slate-200" />
      <div className="flex w-full justify-between items-center">
        <Skeleton className="w-[12rem] h-[2rem] rounded-lg bg-slate-200" />
        <Skeleton className="w-[10rem] h-[2rem] rounded-lg bg-slate-200" />
      </div>
      <div className="flex w-full justify-between items-center">
        <Skeleton className="w-[10rem] h-[5rem] rounded-lg bg-slate-200" />
        <Skeleton className="w-[8rem] h-[5rem] rounded-lg bg-slate-200" />
      </div>
      <div className="flex w-full justify-between items-center">
        <Skeleton className="w-[12rem] h-[2rem] rounded-lg bg-slate-200" />
        <Skeleton className="w-[10rem] h-[2rem] rounded-lg bg-slate-200" />
      </div>
      {/* <Skeleton className="w-full h-[18rem] rounded-md bg-slate-200" /> */}
    </div>
  );
};
