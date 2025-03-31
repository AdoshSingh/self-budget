import { NextRequest, NextResponse } from "next/server";
import fundService  from "@/services/fundService";
import Logger from "@/utils/logger";
import ResponseWrapper from "@/utils/responseWrapper";

export const PUT = async (req: NextRequest) => {
  const responseWrapper = new ResponseWrapper();
  const logger = new Logger();
  try {
    const body = await req.json();
    const result = await fundService.createFund(body);
    return NextResponse.json(result);
  } catch (error) {
    logger.error(error, 'PUT', '/api/fund');
    return NextResponse.json(responseWrapper.error());
  }
}
 
export const GET = async (req: NextRequest) => {
  const responseWrapper = new ResponseWrapper();
  const logger = new Logger();
  try {
    const accountId = req.nextUrl.searchParams.get("accountId");
    const fundId = req.nextUrl.searchParams.get("fundId");
    if(!accountId) {
      return NextResponse.json(responseWrapper.response(400, 'Invalid account Id. Please try again.'));
    }
    if(fundId) {
      const result = await fundService.getFund(fundId, accountId);
      return NextResponse.json(result);
    } else {
      const result = await fundService.getAllFunds(accountId);
      return NextResponse.json(result);
    }
  } catch (error) {
    logger.error(error, 'GET', '/api/fund');
    return NextResponse.json(responseWrapper.error());
  }
}

export const DELETE = async(req: NextRequest) => {
  const responseWrapper = new ResponseWrapper();
  const logger = new Logger();
  try {
    
  } catch (error) {
    logger.error(error, 'PUT', '/api/fund');
    return NextResponse.json(responseWrapper.error());
  }
  const fundId = req.nextUrl.searchParams.get("fundid");
  await fundService.removeFund(fundId as string);
  return NextResponse.json({status: 200, data: 'Fund deleted successfully'});
}