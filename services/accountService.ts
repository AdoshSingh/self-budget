import { accountRepository } from "@/db/repositories/accountRepository";
import ResponseWrapper from "@/utils/responseWrapper";

class AccountService {
  private static instance: AccountService;
  private responseWrapper: ResponseWrapper;

  private constructor() {
    this.responseWrapper = new ResponseWrapper();
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
  ) {
    try {
      const result = await accountRepository.createAccount(
        primary_balance,
        secondary_balance,
        uesrId
      );
      return this.responseWrapper.response(result.status, result.message, result.data);
    } catch (error) {
      console.error('Error in createAccount service -> ', error);
      return this.responseWrapper.error();
    }
  }

  public async getAccount(userId: string) {
    try {
      const result = await accountRepository.getAccount(userId);
      return this.responseWrapper.response(result.status, result.message, result.data);
    } catch (error) {
      console.error('Error in getAccount service -> ', error);
      return this.responseWrapper.error();
    }
  }
}

const accountService = AccountService.getInstance();
export default accountService;
