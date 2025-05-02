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
  disabled,
}: {
  title: string;
  options: string[];
  selection: T;
  setSelection: React.Dispatch<React.SetStateAction<T>>;
  disabled?: string;
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
            <SelectItem key={ind} value={ele} disabled={ele === disabled}>
              {ele.charAt(0).toLocaleUpperCase() +
                ele.slice(1).toLocaleLowerCase()}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
