import { Skeleton } from "@/components/ui/skeleton";

export const FundSkeleton = () => {
  return (
    <div className="p-6 flex flex-col gap-4 w-full">
      <div className="flex w-full justify-between items-center">
        <Skeleton className="w-[16rem] h-[5rem] rounded-lg bg-slate-200"/>
        <Skeleton className="w-[16rem] h-[5rem] rounded-lg bg-slate-200"/>
      </div>
      <Skeleton className="w-full h-[10rem] rounded-lg bg-slate-200"/>
      <Skeleton className="w-full h-[10rem] rounded-lg bg-slate-200"/>
      <Skeleton className="w-full h-[10rem] rounded-lg bg-slate-200"/>
    </div>
  );
};
