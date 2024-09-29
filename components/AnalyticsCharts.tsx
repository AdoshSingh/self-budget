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

export const description = "A bar chart";

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
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
    { month: string; desktop: number }[]
  >([]);

  useEffect(() => {
    const currDate = new Date();
    const initialTransactions = transactions.filter((transaction) => {
      const transactionYear = transaction.date.getFullYear();
      return currDate.getFullYear() === transactionYear;
    });
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
      if (monthToSpendings[currMonth]) {
        monthToSpendings[currMonth] += currAmount;
      }
    });

    const initialChartData = Object.entries(monthToSpendings).map(
      ([month, desktop]) => ({ month, desktop })
    );

    setChartData(initialChartData);
  }, []);

  return (
    <div className=" w-[32rem] h-[64rem]">
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
            content={<ChartTooltipContent hideLabel />}
          />
          <Bar dataKey="desktop" fill="var(--color-desktop)" radius={8} />
        </BarChart>
      </ChartContainer>
    </div>
  );
};

export default AnalyticsCharts;
