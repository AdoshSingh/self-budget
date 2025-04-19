import { ApiService } from "../apiService";
import type { Account } from "@/domain/prismaTypes";

class AccountApiService {
  private static instance: AccountApiService;
  private apiService: ApiService;

  private constructor() {
    this.apiService = new ApiService();
  }

  public static getInstance() {
    if (!AccountApiService.instance) {
      AccountApiService.instance = new AccountApiService();
    }
    return AccountApiService.instance;
  }   

  public async addAccount(userId: string) {
    return await this.apiService.put<{status: number, message?: string, data?: any}>('/api/account', { userId });
  }

  public async getAccount(userId: string) {
    return await this.apiService.get<{status: number, message?: string, data: Account | null | undefined}>('/api/account', { userId });
  }
}


export const accountApiService = AccountApiService.getInstance();