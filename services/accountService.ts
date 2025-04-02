import { accountRepository } from "@/db/repositories/accountRepository";
import Logger from "@/utils/logger";
import ResponseWrapper from "@/utils/responseWrapper";
import type { ServiceResponse } from "@/domain/returnTypes";

class AccountService {
  private static instance: AccountService;
  private responseWrapper: ResponseWrapper;
  private logger: Logger;

  private constructor() {
    this.responseWrapper = new ResponseWrapper();
    this.logger = new Logger();
  }

  public static getInstance() {
    if (!AccountService.instance) {
      AccountService.instance = new AccountService();
    }
    return AccountService.instance;
  }

  public async createAccount(
    primary_balance: number = 0,
    secondary_balance: number = 0,
    uesrId: string
  ): Promise<ServiceResponse> {
    try {
      const result = await accountRepository.createAccount(
        primary_balance,
        secondary_balance,
        uesrId
      );
      return this.responseWrapper.response(result.status, result.message, result.data);
    } catch (error) {
      this.logger.error(error, 'createAccount', 'AccountService');
      return this.responseWrapper.error();
    }
  }

  public async getAccount(userId: string): Promise<ServiceResponse> {
    try {
      const result = await accountRepository.getAccount(userId);
      return this.responseWrapper.response(result.status, result.message, result.data);
    } catch (error) {
      this.logger.error(error, 'getAccount', 'AccountService');
      return this.responseWrapper.error();
    }
  }
}

const accountService = AccountService.getInstance();
export default accountService;
