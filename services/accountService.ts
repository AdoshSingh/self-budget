import { accountRepository } from "@/db/repositories/accountRepository";

class AccountService {
  private static instance: AccountService;

  private constructor() {}

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
    const newAccount = await accountRepository.createAccount(
      primary_balance,
      secondary_balance,
      uesrId
    );
    return newAccount;
  }

  public async getAccount(userId: string) {
    const existingAccount = await accountRepository.getAccount(userId);
    return existingAccount;
  }
}

const accountService = AccountService.getInstance();
export default accountService;
