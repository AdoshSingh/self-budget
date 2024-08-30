"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function CustomDropdown<T>({
  title,
  options,
  selection,
  setSelection,
}: {
  title: string;
  options: string[];
  selection: T;
  setSelection: React.Dispatch<React.SetStateAction<T>>;
}) {
  return (
    <Select onValueChange={(val) => setSelection(val as T)}>
      <SelectTrigger className="w-full">
        <SelectValue
          placeholder={selection === "" ? title : (selection as T as string)}
        />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {options.map((ele, ind) => (
            <SelectItem key={ind} value={ele}>
              {ele.charAt(0).toLocaleUpperCase() +
                ele.slice(1).toLocaleLowerCase()}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
