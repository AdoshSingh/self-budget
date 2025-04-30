import { Skeleton } from "./ui/skeleton";

export const TransactionSkeleton = () => {
  return (
    <div className="p-6 flex flex-col gap-4">
      <div className=" flex justify-between w-full items-center">
        <Skeleton className="w-[10rem] h-[2rem] rounded-lg bg-slate-200" />
        <Skeleton className="w-[6rem] h-[2rem] rounded-lg bg-slate-200" />
      </div>
      <Skeleton className="w-full h-[30rem] rounded-lg bg-slate-200" />
    </div>
  );
};
