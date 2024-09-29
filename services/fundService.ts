import { fundRepository } from "@/db/repositories/fundRepository";
import type { FundRequest } from "@/domain/requestTypes";

class FundService {
  private static instance: FundService;
  private constructor() {}

  public static getInstance() {
    if (!FundService.instance) {
      FundService.instance = new FundService();
    }
    return FundService.instance;
  }

  public async createFund(args: FundRequest) {
    return await fundRepository.createFund(
      args.title,
      args.target,
      args.installment,
      args.duration,
      args.accountId
    );
  }

  public async getAllFunds(accountId: string) {
    return await fundRepository.getAllFunds(accountId);
  }

  public async getFund(fundId: string) {
    return await fundRepository.getFund(fundId);
  }

  public async addMoneyInFunds(fundId: string, amount: number) {
    return await fundRepository.addMoneyInFunds(fundId, amount);
  }

  public async removeMoneyFromFunds(fundId: string, amount: number) {
    return await fundRepository.removeMoneyFromFunds(fundId, amount);
  }

  public async removeFund(fundId: string) {
    return await fundRepository.removeFund(fundId);
  }
}

const fundService = FundService.getInstance();
export default fundService;