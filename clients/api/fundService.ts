import { ApiService } from "../apiService";
import type { FundRequest } from "@/domain/requestTypes";
import type { Fund } from "@/domain/prismaTypes";

class FundApiService {
  private static instance: FundApiService;
  private apiService: ApiService;

  private constructor() {
    this.apiService = new ApiService();
  }

  public static getInstance() {
    if(!FundApiService.instance) {
      FundApiService.instance = new FundApiService();
    }
    return FundApiService.instance;
  }

  public async getAllFunds(accountId: string)  {
    return await this.apiService.get<{status: number, message?: string, data: Fund[] | null | undefined}>("/api/fund", { accountId });
  }

  public async createFund(args: FundRequest) {
    return await this.apiService.put<{status: number, message?: string, data: Fund | null | undefined}>("/api/fund", {
      title: args.title,
      target: args.target,
      installment: args.installment,
      duration: args.duration,
      accountId: args.accountId
    });
  }

  public async deleteFund(fundId: string) {
    return await this.apiService.delete<{status: number, message?: string, data: Fund | null | undefined}>("/api/fund", { fundId });
  }
}

export const fundApiService = FundApiService.getInstance();