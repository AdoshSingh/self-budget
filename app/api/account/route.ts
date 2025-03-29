import { NextRequest, NextResponse } from "next/server";
import accountService from "@/services/accountService";
import ResponseWrapper from "@/utils/responseWrapper";

export const PUT = async (req: NextRequest) => {
  const responseWrapper = new ResponseWrapper();
  try {
    const body = await req.json();
    const userId = body.userId;
    const result = await accountService.createAccount(
      undefined,
      undefined,
      userId
    );
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error -> ', error);
    return NextResponse.json(responseWrapper.error());
  }
};

export const GET = async (req: NextRequest) => {
  const responseWrapper = new ResponseWrapper();
  try {
    const userId = req.nextUrl.searchParams.get("userid") as string;
    const result = await accountService.getAccount(userId);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error -> ', error);
    return NextResponse.json(responseWrapper.error());
  }
};
