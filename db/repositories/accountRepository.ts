import prisma from "../prismaClient";
import type { Account, Transaction } from "@/domain/prismaTypes";
import { fundRepository } from "./fundRepository";
import userRepository from "./userRepository";
import Logger from "@/utils/logger";
import type { RepoResult } from "@/domain/returnTypes";

class AccountRepository {
  private static instance: AccountRepository;
  private dbClient: typeof prisma;
  private logger: Logger;

  private constructor(dbClient: typeof prisma) {
    this.dbClient = dbClient;
    this.logger = new Logger();
  }

  public static getInstance(dbClient: typeof prisma) {
    if (!AccountRepository.instance) {
      AccountRepository.instance = new AccountRepository(dbClient);
    }
    return AccountRepository.instance;
  }

  public async createAccount(
    primary_balance: number = 0,
    secondary_balance: number = 0,
    userId: string
  ): Promise<RepoResult> {
    try {
      const userExists = (await userRepository.findUser(userId)).data;
      if (!userExists) {
        return { status: 400, message: "User does not exist" };
      }

      const accountExists = await this.dbClient.account.findUnique({
        where: { userId: userId },
      });
      if (accountExists) {
        return {
          status: 409,
          message: "Account already exists for this user.",
        };
      }

      if (isNaN(primary_balance) || primary_balance < 0) {
        return { status: 400, message: "Invalid primary balance." };
      }
      if (isNaN(secondary_balance) || secondary_balance < 0) {
        return { status: 400, message: "Invalid secondary balance." };
      }

      const newAccount = await this.dbClient.account.create({
        data: {
          primary_balance: primary_balance,
          need: (primary_balance * 50) / 100,
          want: (primary_balance * 30) / 100,
          investment: (primary_balance * 20) / 100,
          secondary_balance: secondary_balance,
          total_balance: primary_balance + secondary_balance,
          userId: userId,
        },
      });
      return {
        status: 201,
        message: "Account added successfully",
        data: newAccount,
      };
    } catch (error) {
      this.logger.error(error, "createAccount", "AccountRepository");
      return { status: 500 };
    }
  }

  public async getAccount(userId: string): Promise<RepoResult> {
    try {
      const userExists = (await userRepository.findUser(userId)).data;
      if (!userExists) {
        return { status: 400, message: "User does not exist" };
      }

      const existingAccount = await this.dbClient.account.findUnique({
        where: {
          userId: userId,
        },
      });
      if (!existingAccount) {
        return { status: 404, message: "Account does not exist." };
      }
      return { status: 200, data: existingAccount };
    } catch (error) {
      this.logger.error(error, "getAccount", "AccountRepository");
      return { status: 500 };
    }
  }

  private async creditAccount(
    transaction: Partial<Transaction>,
    account: Account,
  ): Promise<RepoResult> {
    try {
      const amount = transaction.amount;
      if (!amount) {
        return {
          status: 400,
          message: "Please enter a valid amount.",
        };
      }
  
      switch (transaction.bracket) {
        case "INCOME": {
          const newNeed = (amount * 50) / 100;
          const newWant = (amount * 30) / 100;
          const newInvest = (amount * 20) / 100;
          const result = await this.dbClient.account.update({
            where: {
              id: account.id,
            },
            data: {
              primary_balance: account.primary_balance + amount,
              need: account.need + newNeed,
              want: account.want + newWant,
              investment: account.investment + newInvest,
              total_balance: account.total_balance + amount,
            },
          });
  
          if (result) {
            return {
              status: 201,
              message: "Account updated successfully",
              data: result,
            };
          }
          return {
            status: 400,
            message: "Failed to update account. Please try again.",
          };
        }
  
        case "UNREGULATED": {
          const result = await this.dbClient.account.update({
            where: { id: account.id },
            data: {
              secondary_balance: account.secondary_balance + amount,
              total_balance: account.total_balance + amount,
            },
          });
  
          if (result) {
            return {
              status: 201,
              message: "Account updated successfully",
              data: result,
            };
          }
          return {
            status: 400,
            message: "Failed to update account. Please try again.",
          };
        }
  
        case "REFUND": {
          if (!transaction.payee) {
            return {
              status: 400,
              message: "Invalid request. Please try again.",
            };
          }
  
          const payeeToField: Record<
            string,
            keyof Pick<typeof account, "need" | "want" | "investment">
          > = {
            NEED: "need",
            WANT: "want",
            INVEST: "investment",
          };
  
          const updatedField = payeeToField[transaction.payee];
  
          if (!updatedField) {
            return {
              status: 400,
              message: "Invalid request. Please try again.",
            };
          }
  
          const result = await this.dbClient.account.update({
            where: { id: account.id },
            data: {
              primary_balance: account.primary_balance + amount,
              [updatedField]: account[updatedField] + amount,
              total_balance: account.total_balance + amount,
            },
          });
  
          if (result) {
            return {
              status: 201,
              message: "Account updated successfully",
              data: result,
            };
          } 
          return {
            status: 400,
            message: "Failed to update account. Please try again.",
          };
        }
  
        default:{
          return {
            status: 400,
            message: "Failed to update account. Please try again.",
          };
        }
      }
    } catch (error) {
      this.logger.error(error, "creditAccount", "AccountRepository");
      return { status: 500 };
    }
  }

  private async debitAccount(
    transaction: Partial<Transaction>,
    account: Account,
  ): Promise<RepoResult> {
    try {
      const amount = transaction.amount;
      if (!amount) return { status: 400, message: "Please enter a valid amount."};
  
      if (!transaction.bracket) return { status: 400, message: "Invalid request. Please try again."};
  
      const brackets: Record<
        string, 
        keyof Pick<typeof account, "need" | "want" | "investment">
      > = {
        NEED: "need",
        WANT: "want",
        INVEST: "investment",
      };
  
      const bracketKey = brackets[transaction.bracket];
      if (!bracketKey) return { status: 400, message: "Invalid transaction bracket." };
  
      const existingBalance = account[bracketKey];
  
      if (amount > existingBalance) {
        return { status: 403, message: `Insufficient balance in '${transaction.bracket}'.` };
      }
  
      const result = await this.dbClient.account.update({
        where: { id: account.id },
        data: {
          primary_balance: account.primary_balance - amount,
          [bracketKey]: existingBalance - amount,
          total_balance: account.total_balance - amount,
        },
      });
  
      if (result) {
        return {
          status: 201,
          message: "Account updated successfully",
          data: result,
        };
      }
      return {
        status: 400,
        message: "Failed to update account. Please try again.",
      };
    } catch (error) {
      this.logger.error(error, "debitAccount", "AccountRepository");
      return { status: 500 };
    }
  }

  private async transferAccount(
    transaction: Partial<Transaction>,
    account: Account,
    fundId?: string
  ): Promise<RepoResult> {
    try {
      const amount = transaction.amount;
      if (!amount) return { status: 400, message: "Please enter a valid amount."};
  
      switch (transaction.bracket) {
        case "SURPLUS": {
          if(amount !== account.primary_balance) {
            return {
              status: 400,
              message: "Invalid amount. Please try again.",
            };
          }
          
          let existingSecondary = account.secondary_balance;
  
          const result = await this.dbClient.account.update({
            where: {
              id: account.id,
            },
            data: {
              primary_balance: 0,
              need: 0,
              want: 0,
              investment: 0,
              secondary_balance: existingSecondary + amount,
            },
          });
          if (result) {
            return {
              status: 201,
              message: "Account updated successfully",
              data: result,
            };
          }
          return {
            status: 400,
            message: "Failed to update account. Please try again.",
          };
        }
  
        case "FUND_TRANSFER":{
          if(!fundId) return { status: 400, message: "Invalid fund ID."};
          if(!transaction.payer) return { status: 400, message: "Invalid payer."};
  
          const existingFund = (await fundRepository.getFund(fundId, account.id)).data;
          if (!existingFund) {
            return {
              status: 404,
              message: "Fund not found.",
            };
          }
  
          if(existingFund.accountId !== account.id) {
            return {
              status: 403,
              message: "Invalid request. Please try again.",
            }
          }
  
          const payer: Record<string, keyof Pick<typeof account, "need" | "want">> = {
            NEED: "need",
            WANT: "want",
          };
  
          const payeeKey = payer[transaction.payer];
  
          if (!payeeKey) {
            return {
              status: 400,
              message: "Invalid payer. Please try again.",
            };
          }
  
          if(amount > account[payeeKey]) {
            return {
              status: 400,
              message: "Invalid amount. Please try again.",
            };
          }
  
          const result = await this.dbClient.account.update({
            where: {
              id: account.id,
            },
            data: {
              primary_balance: account.primary_balance - amount,
              [payeeKey]: account[payeeKey] - amount,
            },
          });
          if(!result) {
            return {
              status: 400,
              message: "Failed to update account. Please try again.",
            };
          }
  
          const updatedFund = (await fundRepository.addMoneyInFunds(fundId, amount)).data;
          if (updatedFund) {
            return {
              status: 201,
              message: "Balance added to fund successfully",
              data: updatedFund,
            };
          }
          return {
            status: 400,
            message: "Failed to update fund. Please try again.",
          };
        }
  
        case "INTERNAL":{
          if (!transaction.payee || !transaction.payer) {
            return {
              status: 400,
              message: "Invalid request. Please try again.",
            };
          }
  
          const payeeField: Record<string, keyof Pick<typeof account, "need" | "want" | "investment">> = {
            NEED: "need",
            WANT: "want",
            INVEST: "investment",
          };
  
          const payeeKey = payeeField[transaction.payee];
          if (!payeeKey) {
            return {
              status: 400,
              message: "Invalid request. Please try again.",
            };
          }
  
          const payerFeild: Record<
            string,
            keyof Pick<
                typeof account,
                "need" | "want" | "investment" | "secondary_balance"
              >
            | "fund"
          > = {
            NEED: "need",
            WANT: "want",
            INVEST: "investment",
            SECONDARY: "secondary_balance",
            FUND: "fund"
          };
  
          const payerKey = payerFeild[transaction.payer];
          if(!payerKey) {
            return {
              status: 400,
              message: "Invalid request. Please try again.",
            };
          }
  
          if(fundId) {
            if(transaction.payer !== "FUND") {
              return {
                status: 400,
                message: "Invalid request. Please try again.",
              }
            }
  
            const existingFund = (await fundRepository.getFund(fundId, account.id)).data;
            if (!existingFund) {
              return {
                status: 404,
                message: "Fund not found.",
              };
            }
  
            if(existingFund.accountId !== account.id) {
              return {
                status: 403,
                message: "Invalid request. Please try again.",
              }
            }
  
            if(amount > existingFund.balance) {
              return {
                status: 403,
                message: `Insufficient balance in fund.`
              }
            }
  
            const result = await this.dbClient.account.update({
              where: {
                id: account.id
              },
              data: {
                primary_balance: account.primary_balance + amount,
                [payeeKey]: account[payeeKey] + amount
              }
            });
            if(!result) {
              return {
                status: 400,
                message: 'Invalid request. Please try again.'
              }
            }
  
            const updatedFund = (await fundRepository.removeMoneyFromFunds(fundId, amount)).data;
            if(!updatedFund) {
              return {
                status: 400,
                message: 'Invalid request. Please try again.'
              }
            }
            return {
              status: 201,
              message: 'Transfer successful'
            }
          } else {
            const payee = transaction.payee;
            const newPayerFeild = Object.fromEntries(
              Object.entries(payerFeild).filter(([ele]) => ele !== payee)
            );
  
            const newPayerKey = newPayerFeild[transaction.payer];
            if(!newPayerKey || newPayerKey === 'fund') {
              return {
                status: 400,
                message: "Invalid request. Please try again.",
              };
            }
  
            if(amount > account[newPayerKey]) {
              return {
                status: 403,
                message: "Not enough balance. Please try again."
              }
            }
  
            if(newPayerKey === "secondary_balance") {
              const result = this.dbClient.account.update({
                where: {id: account.id},
                data: {
                  primary_balance: account.primary_balance + amount,
                  [payeeKey]: account[payeeKey] + amount,
                  [newPayerKey]: account[newPayerKey] - amount
                }
              });
              if(!result) {
                return {
                  status: 400,
                  message: "Invalid request. Please try again."
                }
              }
  
              return {
                status: 201, 
                message: 'Transfer completed successfully.',
                data: result
              }
            } else {
              const result = this.dbClient.account.update({
                where: {id: account.id},
                data: {
                  [payeeKey]: account[payeeKey] + amount,
                  [newPayerKey]: account[newPayerKey] - amount
                }
              });
              if(!result) {
                return {
                  status: 400,
                  message: "Invalid request. Please try again."
                }
              }
  
              return {
                status: 201, 
                message: 'Transfer completed successfully.',
                data: result
              }
            }
          }
        }
  
        default:{
          return {
            status: 400,
            message: "Invalid request. Please try again."
          }
        }
      }
    } catch (error) {
      this.logger.error(error, "updateAccount", "AccountRepository");
      return { status: 500 };
    }
  }

  public async updateAccount(
    transaction: Partial<Transaction>,
    fundId?: string
  ): Promise<RepoResult> {
    try {
      const existingAccount = await this.dbClient.account.findUnique({
        where: {
          id: transaction.accountId,
        },
      });
      if (!existingAccount) {
        return {
          status: 404,
          message: "Account not found for given account ID.",
        };
      }

      switch (transaction.type) {
        case "CREDIT": {
          const result = await this.creditAccount(
            transaction,
            existingAccount,
          );
          return {
            status: result.status,
            message: result.message,
            data: result.data,
          };
        }
        case "DEBIT": {
          const result = await this.debitAccount(
            transaction,
            existingAccount,
          );
          return {
            status: result.status,
            message: result.message,
            data: result.data,
          };
        }
        case "TRANSFER": {
          const result = await this.transferAccount(
            transaction,
            existingAccount,
            fundId
          );
          return {
            status: result.status,
            message: result.message,
            data: result.data,
          };
        }
        default: {
          return {
            status: 400,
            message: "Invalid transaction, please try again.",
          };
        }
      }
    } catch (error) {
      this.logger.error(error, "updateAccount", "AccountRepository");
      return { status: 500 };
    }
  }

  public async deleteAccount() {}
}

export const accountRepository = AccountRepository.getInstance(prisma);
