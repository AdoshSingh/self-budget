"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function CustomDropdown({
  title,
  options,
  selection,
  setSelection,
}: {
  title: string;
  options: string[];
  selection: string;
  setSelection: React.Dispatch<React.SetStateAction<string>>;
}) {

  return (
    <Select
      onValueChange={(val) => setSelection(val)}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder={selection === "" ? title : selection} />
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
