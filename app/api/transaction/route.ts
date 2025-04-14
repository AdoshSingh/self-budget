import { NextRequest, NextResponse } from "next/server";
import transactionService from "@/services/transactionService";
import Logger from "@/utils/logger";
import ResponseWrapper from "@/utils/responseWrapper";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const GET = async (req: NextRequest) => {
  const logger = new Logger();
  const responseWrapper = new ResponseWrapper();
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(responseWrapper.fail(401, "Unauthorized"));
    }
    const accountId = req.nextUrl.searchParams.get("accountId");
    const transactionId = req.nextUrl.searchParams.get("transactionId");

    if (!accountId) {
      return NextResponse.json(responseWrapper.fail(400, "Invalid accountId"));
    }

    if (!transactionId) {
      const result = await transactionService.getTransactions(accountId);
      return NextResponse.json(result);
    }

    const result = await transactionService.getOneTransaction(transactionId);
    return NextResponse.json(result);
  } catch (error) {
    logger.error(error, "GET", "/api/transaction");
    return NextResponse.json(responseWrapper.error());
  }
};

export const PUT = async (req: NextRequest) => {
  const logger = new Logger();
  const responseWrapper = new ResponseWrapper();
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(responseWrapper.fail(401, "Unauthorized"));
    }
    const { type, date, payee, bracket, payer, amount, accountId, fundId } =
      await req.json();

    const result = await transactionService.addTransaction(
      type,
      date,
      payee,
      bracket,
      payer,
      amount,
      accountId,
      fundId
    );

    return NextResponse.json(result);
  } catch (error) {
    logger.error(error, "PUT", "/api/transaction");
    return NextResponse.json(responseWrapper.error());
  }
};
