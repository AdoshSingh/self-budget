"use client";
import type { Transaction } from "@/domain/prismaTypes";
import { useEffect, useState } from "react";
import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import millify from "millify";
import { ScrollArea } from "./ui/scroll-area";
import { convertToCurrency } from "@/utils/formatNumber";

export const description = "A bar chart";

const chartConfig = {
  amount: {
    label: "Amount",
    color: "#0f172a",
  },
} satisfies ChartConfig;

const AnalyticsCharts = ({ transactions }: { transactions: Transaction[] }) => {
  const [filteredTransactions, setFilteredTransactions] = useState<
    Transaction[]
  >([]);
  const [filterTranTypes, setFilterTranTypes] = useState([
    "NEED",
    "WANT",
    "INVEST",
  ]);
  const [filterYear, setFilterYear] = useState(new Date().getFullYear());
  const [filterMonth, setFilterMonth] = useState();
  const [chartData, setChartData] = useState<
    { month: string; amount: number }[]
  >([]);
  const [amountEarned, setAmountEarned] = useState<number>();
  const [amountSpent, setAmountSpent] = useState<number>();

  useEffect(() => {
    if (!transactions) {
      return;
    }
    const currDate = new Date();

    let totalEarned = 0;
    let totalSpent = 0;

    const initialTransactions = transactions.filter((transaction) => {
      const transactionYear = transaction.date.getFullYear();
      if (currDate.getFullYear() === transactionYear) {
        switch (transaction.type) {
          case "CREDIT":
            {
              totalEarned += transaction.amount;
            }
            break;
          case "DEBIT":
            {
              if (transaction.bracket !== "FUND_DEBIT")
                totalSpent += transaction.amount;
            }
            break;
        }
      }
      return (
        currDate.getFullYear() === transactionYear &&
        transaction.type === "DEBIT" &&
        transaction.bracket !== "FUND_DEBIT"
      );
    });

    setAmountEarned(totalEarned);
    setAmountSpent(totalSpent);
    setFilteredTransactions(initialTransactions);

    let monthToSpendings: { [Key: string]: number } = {
      Jan: 0,
      Feb: 0,
      Mar: 0,
      Apr: 0,
      May: 0,
      Jun: 0,
      Jul: 0,
      Aug: 0,
      Sep: 0,
      Oct: 0,
      Nov: 0,
      Dec: 0,
    };

    initialTransactions.forEach((transaction) => {
      const currAmount = transaction.amount;
      const currMonth = transaction.date.toLocaleString("en-US", {
        month: "short",
      });
      if (monthToSpendings[currMonth] >= 0) {
        monthToSpendings[currMonth] += currAmount;
      }
    });

    const initialChartData = Object.entries(monthToSpendings).map(
      ([month, amount]) => ({ month, amount })
    );

    setChartData(initialChartData);
  }, [transactions]);

  return (
    <div className=" flex-1 p-6 h-full overflow-auto space-y-6">
      <div className="flex justify-between items-center">
        <span className="text-2xl">Analytics Dashboard</span>
      </div>
      <div className="flex gap-6 w-[42rem]">
        <div className=" border rounded-md p-3 flex items-center gap-2 justify-between flex-1">
          <h1>Total Earned: </h1>{" "}
          <span className="text-green-500">
            {convertToCurrency(amountEarned)}
          </span>
        </div>
        <div className=" border rounded-md p-3 flex items-center gap-2 justify-between flex-1">
          <h1>Total Spent: </h1>{" "}
          <span className="text-red-500">{convertToCurrency(amountSpent)}</span>
        </div>
      </div>
      <ScrollArea className="border rounded-md w-[42rem]">
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  formatter={(value, name) => {
                    return (
                      <>
                        <div
                          className="h-3 w-3 rounded"
                          style={{ backgroundColor: "var(--color-amount)" }}
                        ></div>
                        <span className=" capitalize">{name}: </span>
                        <span>{millify(value as number)}</span>
                      </>
                    );
                  }}
                  hideLabel
                />
              }
            />
            <Bar dataKey="amount" fill="var(--color-amount)" radius={8} />
          </BarChart>
        </ChartContainer>
      </ScrollArea>
    </div>
  );
};

export default AnalyticsCharts;
