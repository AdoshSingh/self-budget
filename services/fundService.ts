import { fundRepository } from "@/db/repositories/fundRepository";
import type { FundRequest } from "@/domain/requestTypes";
import Logger from "@/utils/logger";
import ResponseWrapper from "@/utils/responseWrapper";
import type { ServiceResponse } from "@/domain/returnTypes";

class FundService {
  private static instance: FundService;
  private logger: Logger;
  private responseWrapper: ResponseWrapper;
  private constructor() {
    this.logger = new Logger();
    this.responseWrapper = new ResponseWrapper();
  }

  public static getInstance() {
    if (!FundService.instance) {
      FundService.instance = new FundService();
    }
    return FundService.instance;
  }

  public async createFund(args: FundRequest): Promise<ServiceResponse> {
    try {
      const result = await fundRepository.createFund(
        args.title,
        args.target,
        args.installment,
        args.duration,
        args.accountId
      );
      return this.responseWrapper.response(result.status, result.message, result.data);
    } catch (error) {
      this.logger.error(error, 'getAllFunds', 'FundService');
      return this.responseWrapper.error();
    }
  }

  public async getAllFunds(accountId: string): Promise<ServiceResponse> {
    try {
      const result = await fundRepository.getAllFunds(accountId);
      return this.responseWrapper.response(result.status, result.message, result.data);
    } catch (error) {
      this.logger.error(error, 'getAllFunds', 'FundService');
      return this.responseWrapper.error();
    }
  }

  public async getFund(fundId: string, accountId: string): Promise<ServiceResponse> {
    try {
      const result = await fundRepository.getFund(fundId, accountId);
      return this.responseWrapper.response(result.status, result.message, result.data);
    } catch (error) {
      this.logger.error(error, 'getFund', 'FundService');
      return this.responseWrapper.error();
    }
  }

  public async addMoneyInFunds(fundId: string, amount: number): Promise<ServiceResponse> {
    try {
      const result = await fundRepository.addMoneyInFunds(fundId, amount);
      return this.responseWrapper.response(result.status, result.message, result.data);
    } catch (error) {
      this.logger.error(error, 'getFund', 'FundService');
      return this.responseWrapper.error();
    }
  }

  public async removeMoneyFromFunds(fundId: string, amount: number): Promise<ServiceResponse> {
    try {
      const result = await fundRepository.removeMoneyFromFunds(fundId, amount);
      return this.responseWrapper.response(result.status, result.message, result.data);
    } catch (error) {
      this.logger.error(error, 'getFund', 'FundService');
      return this.responseWrapper.error();
    }
  }

  public async removeFund(fundId: string): Promise<ServiceResponse> {
    try {
      const result = await fundRepository.removeFund(fundId);
      return this.responseWrapper.response(result.status, result.message, result.data);
    } catch (error) {
      this.logger.error(error, 'getFund', 'FundService');
      return this.responseWrapper.error();
    }
  }
}

const fundService = FundService.getInstance();
export default fundService;