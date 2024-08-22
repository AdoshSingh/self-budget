import { NextRequest, NextResponse } from "next/server";
import accountService from "@/services/accountService";

export const PUT = async (req: NextRequest) => {
  const body = await req.json();
  const userId = body.userId;
  const newAccount = await accountService.createAccount(
    undefined,
    undefined,
    userId
  );
  return NextResponse.json({ status: 201, data: newAccount });
};

export const GET = async (req: NextRequest) => {
  const userId = req.nextUrl.searchParams.get("userid") as string;
  const existingAccount = await accountService.getAccount(userId);
  return NextResponse.json({ status: 200, data: existingAccount });
};
