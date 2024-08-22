import { NextRequest, NextResponse } from "next/server";
import transactionService from "@/services/transactionService";

export const GET = async (req: NextRequest) => {
  const accountId = req.nextUrl.searchParams.get("accountid");
  const transactionId = req.nextUrl.searchParams.get("userid");
  if (!transactionId || transactionId === "") {
    const transactions = await transactionService.getTransactions(
      accountId as string
    );
    return NextResponse.json({ status: 200, data: transactions });
  } else {
    const transaction = await transactionService.getOneTransaction(
      transactionId
    );
    return NextResponse.json({ status: 200, data: transaction });
  }
};
