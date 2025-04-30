"use client";

import type { Transaction ,BracketType, TransactionType} from "@/domain/prismaTypes";
import { DataTable } from "./DataTable";
import { useTransactionStore } from "@/store/transactionStore";
import {
  ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { convertToCurrency } from "@/utils/formatNumber";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { AddTransaction } from "./AddTransaction";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

const TransactionInfo = () => {

  const transactions = useTransactionStore((state) => state.transactions); 
  
  const _columns: ColumnDef<Transaction>[] = [
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }) => {
        const tranDate = new Date(row.getValue("date"));
        const formattedDate = tranDate.toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });
        return <div className=" text-nowrap">{formattedDate}</div>;
      },
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => <div>{row.getValue("type")}</div>,
    },
    {
      accessorKey: "bracket",
      header: "Bracket",
      cell: ({ row }) => <div>{row.getValue("bracket")}</div>,
    },
    {
      accessorKey: "payee",
      header: "Payee",
      cell: ({ row }) => <div>{row.getValue("payee")}</div>,
    },
    {
      accessorKey: "payer",
      header: "Payer",
      cell: ({ row }) => <div>{row.getValue("payer")}</div>,
    },
    {
      accessorKey: "amount",
      header: () => <div className="text-right">Amount</div>,
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("amount"));
        const formatted = convertToCurrency(amount);
        const type = row.getValue("type") as TransactionType;
        const bracket = row.getValue("bracket") as BracketType;
        return (
          <div
            className={`text-right ${
              type === "CREDIT"
                ? "text-green-500"
                : type === "DEBIT"
                ? bracket === "FUND_DEBIT"
                ? "text-black"
                : "text-red-500"
                : "text-black"
            }`}
          >
            {formatted}
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: transactions || [],
    columns: _columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel()
  });

  return (
    <div className="w-full p-6">
      <div className="flex items-center py-4 gap-4">
        <Input
          placeholder="Filter Payee..."
          value={(table.getColumn("payee")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("payee")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <AddTransaction />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <DataTable table={table}/>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          Showing {table.getRowModel().rows?.length} of {transactions?.length} transaction(s).
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TransactionInfo;
