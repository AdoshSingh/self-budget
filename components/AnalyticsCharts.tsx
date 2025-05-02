"use client";
import type { Transaction } from "@/domain/prismaTypes";
import { useEffect, useState, useRef } from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import millify from "millify";
import { ScrollArea } from "./ui/scroll-area";
import { convertToCurrency } from "@/utils/formatNumber";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { transactionOptions, months, monthNameToNumber } from "@/constants/constant";
import { Checkbox } from "./ui/checkbox";
import { CustomDropdown } from "./CustomDropdown";
import { Separator } from "./ui/separator";
import { Input } from "./ui/input";
import { BracketType } from "@/domain/prismaTypes";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useMediaQuery } from "@/hooks/use-media-query";

type BracketState = Pick<Record<BracketType, boolean>, "NEED" | "WANT" | "INVEST" | "REFUND" | "INCOME" | "UNREGULATED">;

export const description = "A bar chart";

const chartConfig = {
  amount: {
    label: "Amount",
    color: "#0f172a",
  },
} satisfies ChartConfig;

const AnalyticsCharts = ({ transactions }: { transactions: Transaction[] }) => {
  const isFirstRender = useRef(true);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [allYears, setAllYears] = useState<string[]>([]);

  //filters
  const [frequencyType, setFrequencyType] = useState("MONTHLY");
  const [filterYear, setFilterYear] = useState("");
  const [filterMonth, setFilterMonth] = useState("");
  const [transactionType, setTransactionType] = useState("DEBIT");
  const [bracketType, setBracketType] = useState<BracketState>({
    NEED: true,
    WANT: true,
    INVEST: true,
    REFUND: true,
    INCOME: true,
    UNREGULATED: true,
  });

  const [chartData, setChartData] = useState<
    | { month: string; amount: number }[]
    | { day: string; amount: number }[]
    | { day: number; amount: number }[]
  >([]);
  const [amountEarned, setAmountEarned] = useState<number>();
  const [amountSpent, setAmountSpent] = useState<number>();

  // initial filters
  useEffect(() => {
    if (!transactions) {
      return;
    }
    const currDate = new Date();

    let allYears = new Set<string>();
    let totalEarned = 0;
    let totalSpent = 0;

    const initialTransactions = transactions.filter((transaction) => {
      const transactionDate = new Date(transaction.date);
      const transactionYear = transactionDate.getFullYear();
      allYears.add(transactionYear.toString());
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
      const transactionDate = new Date(transaction.date);
      const currMonth = transactionDate.toLocaleString("en-US", {
        month: "short",
      });
      if (monthToSpendings[currMonth] >= 0) {
        monthToSpendings[currMonth] += currAmount;
      }
    });

    const initialChartData = Object.entries(monthToSpendings).map(
      ([month, amount]) => ({ month, amount })
    );

    setFilterYear(currDate.getFullYear().toString());
    setFilterMonth(currDate.toLocaleString("en-US", { month: "short" }));
    setAllYears(Array.from(allYears));
    setAmountEarned(totalEarned);
    setAmountSpent(totalSpent);
    setFilteredTransactions(initialTransactions);
    setChartData(initialChartData);
  }, [transactions]);

  const updateFilterMonthly = (
    changedTransactionType?: string,
    changedBracketType?: BracketState
  ) => {
    const yearlyTransactions = transactions.filter((transaction) => {
      const transactionDate = new Date(transaction.date);
      const transactionYear = transactionDate.getFullYear();
      return (
        Number(filterYear) === transactionYear &&
        transaction.type === (changedTransactionType ?? transactionType) &&
        transaction.bracket in (changedBracketType ?? bracketType) &&
        (changedBracketType ?? bracketType)[
          transaction.bracket as keyof typeof bracketType
        ]
      );
    });
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
    yearlyTransactions.forEach((transaction) => {
      const amt = transaction.amount;
      const mon = transaction.date.toLocaleString("en-US", {
        month: "short",
      });
      if (monthToSpendings[mon] >= 0) {
        monthToSpendings[mon] += amt;
      }
    });
    const newChartData = Object.entries(monthToSpendings).map(
      ([month, amount]) => ({ month, amount })
    );
    return newChartData;
  };

  const updateFilterDaily = (
    changedTransactionType?: string,
    changedBracketType?: BracketState
  ) => {
    const monthlyTransactions = transactions.filter((transaction) => {
      const transactionMonth = transaction.date.toLocaleString("en-US", {
        month: "short",
      });
      const transactionDate = new Date(transaction.date);
      const transactionYear = transactionDate.getFullYear();
      return (
        transactionYear === Number(filterYear) &&
        transactionMonth === filterMonth &&
        transaction.type === (changedTransactionType ?? transactionType) &&
        transaction.bracket in (changedBracketType ?? bracketType) &&
        (changedBracketType ?? bracketType)[
          transaction.bracket as keyof typeof bracketType
        ]
      );
    });

    const daysInMonth = new Date(
      Number(filterYear),
      monthNameToNumber[filterMonth] + 1,
      0
    ).getDate();

    let daysToSpendings: { [key: string]: number } = {};
    for (let day = 1; day <= daysInMonth; day++) {
      daysToSpendings[day] = 0;
    }

    monthlyTransactions.forEach((transaction) => {
      const currAmount = transaction.amount;
      const transactionDate = new Date(transaction.date);
      const currDate = transactionDate.getDate();
      if (daysToSpendings[currDate] >= 0) {
        daysToSpendings[currDate] += currAmount;
      }
    });

    const newChartData = Object.entries(daysToSpendings).map(
      ([month, amount]) => ({ month, amount })
    );
    return newChartData;
  };

  const handleChangeRadioButton = (value: string, type: string) => {
    switch (type) {
      case "transactionType":
        {
          switch (frequencyType) {
            case "MONTHLY":
              {
                const newChartData = updateFilterMonthly(value);
                setChartData(newChartData);
              }
              break;
            case "DAILY":
              {
                const newChartData = updateFilterDaily(value);
                setChartData(newChartData);
              }
              break;
          }
          setTransactionType(value);
        }
        break;
      case "frequencyType":
        {
          if (value === "DAILY") {
            const newChartData = updateFilterDaily();
            setChartData(newChartData);
          } else {
            const newChartData = updateFilterMonthly();
            setChartData(newChartData);
          }
          setFrequencyType(value);
        }
        break;
    }
  };

  const handleCheckboxChecks = (
    value: keyof BracketState,
    checked: string | boolean
  ) => {
    let prevBracketState = bracketType;
    if (typeof checked === "boolean") {
      prevBracketState[value] = checked;
    }
    switch (frequencyType) {
      case "MONTHLY":
        {
          const newChartData = updateFilterMonthly(undefined, prevBracketState);
          setChartData(newChartData);
        }
        break;
      case "DAILY":
        {
          const newChartData = updateFilterDaily(undefined, prevBracketState);
          setChartData(newChartData);
        }
        break;
    }
    setBracketType((prev) => ({
      ...prev,
      [value]: checked,
    }));
  };

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    switch (frequencyType) {
      case "MONTHLY":
        {
          const newChartData = updateFilterMonthly();
          setChartData(newChartData);
        }
        break;
      case "DAILY":
        {
          const newChartData = updateFilterDaily();
          setChartData(newChartData);
        }
        break;
    }
  }, [filterYear, filterMonth]);

  return (
    <div className=" flex-1 p-6 h-full overflow-auto space-y-3 sm:space-y-6">
      <div className="flex justify-between items-center mb-6 sm:mb-0">
        <span className="text-2xl">Analytics Dashboard</span>
      </div>
      <div className="flex gap-3 sm:gap-6 flex-1 flex-col sm:flex-row">
        <div className=" border rounded-md p-2 sm:p-3 flex items-center gap-2 justify-between flex-1">
          <h1>Total Earned: </h1>{" "}
          <span className="text-green-500">
            {convertToCurrency(amountEarned)}
          </span>
        </div>
        <div className=" border rounded-md p-2 sm:p-3 flex items-center gap-2 justify-between flex-1">
          <h1>Total Spent: </h1>{" "}
          <span className="text-red-500">{convertToCurrency(amountSpent)}</span>
        </div>
      </div>
      <div className="flex flex-col gap-3 sm:gap-6">
        <div className=" p-3 border rounded-md flex flex-col gap-4">
          <h1 className=" text-xl">Filters</h1>
          {isDesktop ? (
            <div className="flex flex-col sm:flex-row gap-6">
              <div className="flex-1 flex flex-col gap-3 sm:gap-6">
                <h1>Frequency</h1>
                <RadioGroup
                  defaultValue="MONTHLY"
                  onValueChange={(value) =>
                    handleChangeRadioButton(value, "frequencyType")
                  }
                  className="flex"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="MONTHLY" id="r3" />
                    <Label htmlFor="r3">Monthly</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="DAILY" id="r4" />
                    <Label htmlFor="r4">Daily</Label>
                  </div>
                </RadioGroup>
                {frequencyType === "MONTHLY" ? (
                  <>
                    <CustomDropdown
                      title="Select year"
                      options={allYears}
                      selection={filterYear}
                      setSelection={setFilterYear}
                    />
                  </>
                ) : (
                  <div className="flex items-center gap-3">
                    <CustomDropdown
                      title="Select year"
                      options={allYears}
                      selection={filterYear}
                      setSelection={setFilterYear}
                    />
                    <CustomDropdown
                      title="Select month"
                      options={months}
                      selection={filterMonth}
                      setSelection={setFilterMonth}
                    />
                  </div>
                )}
              </div>
              <div className="flex-1 flex flex-col gap-3 sm:gap-6">
                <h1>Transaction Type</h1>
                <RadioGroup
                  defaultValue="DEBIT"
                  onValueChange={(value) =>
                    handleChangeRadioButton(value, "transactionType")
                  }
                  className="flex"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="DEBIT" id="r1" />
                    <Label htmlFor="r1">Debit</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="CREDIT" id="r2" />
                    <Label htmlFor="r2">Credit</Label>
                  </div>
                </RadioGroup>
              </div>
              <div className="flex-1 flex flex-col gap-3 sm:gap-6">
                <h1>Bracket Type</h1>
                {transactionType === "DEBIT" ? (
                  <div className="flex gap-4">
                    <div className="flex items-center gap-1">
                      <Checkbox
                        value="NEED"
                        checked={bracketType["NEED"]}
                        onCheckedChange={(checked) => {
                          handleCheckboxChecks("NEED", checked);
                        }}
                      />
                      <Label>Need</Label>
                    </div>
                    <div className="flex items-center gap-1">
                      <Checkbox
                        value="WANT"
                        checked={bracketType["WANT"]}
                        onCheckedChange={(checked) => {
                          handleCheckboxChecks("WANT", checked);
                        }}
                      />
                      <Label>Want</Label>
                    </div>
                    <div className="flex items-center gap-1">
                      <Checkbox
                        value="INVEST"
                        checked={bracketType["INVEST"]}
                        onCheckedChange={(checked) => {
                          handleCheckboxChecks("INVEST", checked);
                        }}
                      />
                      <Label>Invest</Label>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-4">
                    <div className="flex items-center gap-1">
                      <Checkbox
                        value="REFUND"
                        checked={bracketType["REFUND"]}
                        onCheckedChange={(checked) => {
                          handleCheckboxChecks("REFUND", checked);
                        }}
                      />
                      <Label>Refund</Label>
                    </div>
                    <div className="flex items-center gap-1">
                      <Checkbox
                        value="INCOME"
                        checked={bracketType["INCOME"]}
                        onCheckedChange={(checked) => {
                          handleCheckboxChecks("INCOME", checked);
                        }}
                      />
                      <Label>Income</Label>
                    </div>
                    <div className="flex items-center gap-1">
                      <Checkbox
                        value="UNREGULATED"
                        checked={bracketType["UNREGULATED"]}
                        onCheckedChange={(checked) => {
                          handleCheckboxChecks("UNREGULATED", checked);
                        }}
                      />
                      <Label>Unregulated</Label>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>Frequency</AccordionTrigger>
                <AccordionContent className="space-y-3">
                  <RadioGroup
                    defaultValue="MONTHLY"
                    onValueChange={(value) =>
                      handleChangeRadioButton(value, "frequencyType")
                    }
                    className="flex"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="MONTHLY" id="r3" />
                      <Label htmlFor="r3">Monthly</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="DAILY" id="r4" />
                      <Label htmlFor="r4">Daily</Label>
                    </div>
                  </RadioGroup>
                  {frequencyType === "MONTHLY" ? (
                    <>
                      <CustomDropdown
                        title="Select year"
                        options={allYears}
                        selection={filterYear}
                        setSelection={setFilterYear}
                      />
                    </>
                  ) : (
                    <div className="flex items-center gap-3">
                      <CustomDropdown
                        title="Select year"
                        options={allYears}
                        selection={filterYear}
                        setSelection={setFilterYear}
                      />
                      <CustomDropdown
                        title="Select month"
                        options={months}
                        selection={filterMonth}
                        setSelection={setFilterMonth}
                      />
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>Transaction Type</AccordionTrigger>
                <AccordionContent>
                  <RadioGroup
                    defaultValue="DEBIT"
                    onValueChange={(value) =>
                      handleChangeRadioButton(value, "transactionType")
                    }
                    className="flex"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="DEBIT" id="r1" />
                      <Label htmlFor="r1">Debit</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="CREDIT" id="r2" />
                      <Label htmlFor="r2">Credit</Label>
                    </div>
                  </RadioGroup>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>Bracket Type</AccordionTrigger>
                <AccordionContent>
                  {transactionType === "DEBIT" ? (
                    <div className="flex gap-4">
                      <div className="flex items-center gap-1">
                        <Checkbox
                          value="NEED"
                          checked={bracketType["NEED"]}
                          onCheckedChange={(checked) => {
                            handleCheckboxChecks("NEED", checked);
                          }}
                        />
                        <Label>Need</Label>
                      </div>
                      <div className="flex items-center gap-1">
                        <Checkbox
                          value="WANT"
                          checked={bracketType["WANT"]}
                          onCheckedChange={(checked) => {
                            handleCheckboxChecks("WANT", checked);
                          }}
                        />
                        <Label>Want</Label>
                      </div>
                      <div className="flex items-center gap-1">
                        <Checkbox
                          value="INVEST"
                          checked={bracketType["INVEST"]}
                          onCheckedChange={(checked) => {
                            handleCheckboxChecks("INVEST", checked);
                          }}
                        />
                        <Label>Invest</Label>
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-4">
                      <div className="flex items-center gap-1">
                        <Checkbox
                          value="REFUND"
                          checked={bracketType["REFUND"]}
                          onCheckedChange={(checked) => {
                            handleCheckboxChecks("REFUND", checked);
                          }}
                        />
                        <Label>Refund</Label>
                      </div>
                      <div className="flex items-center gap-1">
                        <Checkbox
                          value="INCOME"
                          checked={bracketType["INCOME"]}
                          onCheckedChange={(checked) => {
                            handleCheckboxChecks("INCOME", checked);
                          }}
                        />
                        <Label>Income</Label>
                      </div>
                      <div className="flex items-center gap-1">
                        <Checkbox
                          value="UNREGULATED"
                          checked={bracketType["UNREGULATED"]}
                          onCheckedChange={(checked) => {
                            handleCheckboxChecks("UNREGULATED", checked);
                          }}
                        />
                        <Label>Unregulated</Label>
                      </div>
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          )}
        </div>
        <ScrollArea className="border rounded-md">
          <ChartContainer config={chartConfig} className="h-full">
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
    </div>
  );
};

export default AnalyticsCharts;
