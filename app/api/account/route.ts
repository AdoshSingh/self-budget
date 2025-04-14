import { NextRequest, NextResponse } from "next/server";
import accountService from "@/services/accountService";
import ResponseWrapper from "@/utils/responseWrapper";
import Logger from "@/utils/logger";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const PUT = async (req: NextRequest) => {
  const responseWrapper = new ResponseWrapper();
  const logger = new Logger();
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(responseWrapper.fail(401, "Unauthorized"));
    }
    const body = await req.json();
    const userId = body.userId;
    const result = await accountService.createAccount(
      undefined,
      undefined,
      userId
    );
    return NextResponse.json(result);
  } catch (error) {
    logger.error(error, "PUT", "/api/account");
    return NextResponse.json(responseWrapper.error());
  }
};

export const GET = async (req: NextRequest) => {
  const responseWrapper = new ResponseWrapper();
  const logger = new Logger();
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(responseWrapper.fail(401, "Unauthorized"));
    }
    const userId = req.nextUrl.searchParams.get("userId") as string;
    if (!userId) {
      return NextResponse.json(responseWrapper.fail(400, "Invalid userId"));
    }
    const result = await accountService.getAccount(userId);
    return NextResponse.json(result);
  } catch (error) {
    logger.error(error, "GET", "/api/account");
    return NextResponse.json(responseWrapper.error());
  }
};
