import { NextRequest, NextResponse } from "next/server";
import  fundService  from "@/services/fundService";

export const PUT = async (req: NextRequest) => {
  const body = await req.json();
  const newFund = await fundService.createFund(body);
  return NextResponse.json({status: 201, data: newFund});
}

export const GET = async (req: NextRequest) => {
  const accountId = req.nextUrl.searchParams.get("accountid");
  const fundId = req.nextUrl.searchParams.get("fundid");
  if(fundId) {
    const existingFund = await fundService.getFund(fundId);
    return NextResponse.json({status: 200, data: existingFund});
  } else if(accountId) {
    const existingFunds = await fundService.getAllFunds(accountId);
    return NextResponse.json({status: 200, data: existingFunds});
  }
}

export const DELETE = async(req: NextRequest) => {
  const fundId = req.nextUrl.searchParams.get("fundid");
  await fundService.removeFund(fundId as string);
  return NextResponse.json({status: 200, data: 'Fund deleted successfully'});
}