import prisma from "../prismaClient";
import type { Account, Transaction } from "@/domain/prismaTypes";
import { transactionRepository } from "./transactionRepository";

class AccountRepository {
  private static instance: AccountRepository;
  private dbClient: typeof prisma;

  private constructor(dbClient: typeof prisma) {
    this.dbClient = dbClient;
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
    uesrId: string
  ) {
    const newAccount = await this.dbClient.account.create({
      data: {
        primary_balance: primary_balance,
        need: (primary_balance * 50) / 100,
        want: (primary_balance * 30) / 100,
        investment: (primary_balance * 20) / 100,
        secondary_balance: secondary_balance,
        userId: uesrId,
      },
    });

    return newAccount;
  }

  public async getAccount(userId: string) {
    const existingAccount = await prisma.account.findUnique({
      where: {
        userId: userId,
      },
    });

    return existingAccount;
  }

  private async creditAccount(
    transaction: Partial<Transaction>,
    account: Account
  ) {
    const newPrice = transaction.amount;
    if (!newPrice) return { remaining: 0, updated: null };
    const newNeed = (newPrice * 50) / 100;
    const newWant = (newPrice * 30) / 100;
    const newInvest = (newPrice * 20) / 100;

    switch (transaction.bracket) {
      case "INCOME":
        const updated = await this.dbClient.account.update({
          where: {
            id: account.id,
          },
          data: {
            primary_balance: account.primary_balance + newPrice,
            need: account.need + newNeed,
            want: account.want + newWant,
            investment: account.investment + newInvest,
          },
        });
        return {
          remaining: 0,
          updated: updated,
        };

      case "UNREGULATED":
        const updated2 = await this.dbClient.account.update({
          where: {
            id: account.id,
          },
          data: {
            secondary_balance: account.secondary_balance + newPrice,
          },
        });
        return {
          remaining: 0,
          updated: updated2,
        };

      default:
        return {
          remaining: 0,
          updated: null,
        };
    }
  }

  private async debitAccount(
    transaction: Partial<Transaction>,
    account: Account
  ) {
    const amount = transaction.amount;
    if (!amount)
      return {
        remaining: 0,
        updated: null,
      };
    let existingNeed = account.need;
    let existingWant = account.want;
    let existingInvest = account.investment;

    switch (transaction.bracket) {
      case "NEED":
        if (amount > existingNeed) {
          return { remaining: amount - existingNeed, updated: null };
        }
        const updated = await this.dbClient.account.update({
          where: {
            id: account.id,
          },
          data: {
            primary_balance: account.primary_balance - amount,
            need: existingNeed - amount,
          },
        });
        return {
          remaining: 0,
          updated: updated,
        };

      case "WANT":
        if (amount > existingWant) {
          return { remaining: amount - existingWant, updated: null };
        }
        const updated2 = await this.dbClient.account.update({
          where: {
            id: account.id,
          },
          data: {
            primary_balance: account.primary_balance - amount,
            want: existingWant - amount,
          },
        });
        return {
          remaining: 0,
          updated: updated2,
        };

      case "INVEST":
        const updated3 = await this.dbClient.account.update({
          where: {
            id: account.id,
          },
          data: {
            primary_balance: account.primary_balance - amount,
            investment: existingInvest - amount,
          },
        });
        return {
          remaining: 0,
          updated: updated3,
        };

      case "FUND_DEBIT":
        //return await fundRepository.debitFund()
        return {
          remaining: 0,
          updated: null,
        };

      default:
        return {
          remaining: 0,
          updated: null,
        };
    }
  }

  private async transferAccount(
    transaction: Partial<Transaction>,
    account: Account
  ) {
    const amount = transaction.amount;
    if (!amount) return {
      remaining: 0,
      updated: null
    };
    let existingNeed = account.need;
    let existingWant = account.want;
    let existingSecondary = account.secondary_balance;
    switch (transaction.bracket) {
      case "SURPLUS":
        const updated = await this.dbClient.account.update({
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
        return {
          remaining: 0,
          updated: updated,
        };

      case "FUND_TRANSFER":
        // return fundRepository.fundTransfer()
        return {
          remaining: 0,
          updated: null,
        };

      case "INTERNAL":
        if (transaction.payee === "NEED") {
          if (amount <= existingWant) {
            const updated2 = await this.dbClient.account.update({
              where: {
                id: account.id,
              },
              data: {
                need: existingNeed + amount,
                want: existingWant - amount,
              },
            });
            return {
              remaining: 0,
              updated: updated2,
            };
          } else if (amount > existingWant && existingWant > 0) {
            const updated2 = await this.dbClient.account.update({
              where: {
                id: account.id,
              },
              data: {
                need: existingNeed + existingWant,
                want: existingWant - existingWant,
              },
            });
            return {
              remaining: amount - existingWant,
              updated: updated2,
            };
          } else if (existingWant === 0 /*&& fundRepo.getFunds > 0*/) {
            // fund transfer internal
            return {
              remaining: 0,
              updated: null,
            };
          } else {
            const updated2 = await this.dbClient.account.update({
              where: {
                id: account.id,
              },
              data: {
                primary_balance: account.primary_balance + amount,
                need: existingNeed + amount,
                secondary_balance: existingSecondary - amount,
              },
            });
            return {
              remaining: 0,
              updated: updated2,
            };
          }
        } else if (transaction.payee === "WANT") {
          // if(fundRepository.getFunds > 0) {
          //   // fund transfer internal
          // } else {
          //   const updated2 = await this.dbClient.account.update({
          //     where: {
          //       id: account.id
          //     },
          //     data: {
          //       primary_balance: account.primary_balance + amount
          //       need: existingNeed + amount,
          //       secondary_balance: existingSecondary - amount,
          //       penalty: account.penalty + amount
          //     }
          //   });
          //   return {
          //     remaining: 0,
          //     updated: updated2
          //   }
          // }

          return {
            remaining: 0,
            updated: null,
          };
        }

      case "PENALTY":
        const updated3 = await this.dbClient.account.update({
          where: {
            id: account.id,
          },
          data: {
            want: existingWant - amount,
            secondary_balance: existingSecondary + amount,
          },
        });
        return {
          remaining: 0,
          updated: updated3,
        };

      default:
        return {
          remaining: 0,
          updated: null,
        };
    }
  }

  public async updateAccount(transaction: Partial<Transaction>) {
    const existingAccount = await this.dbClient.account.findUnique({
      where: {
        id: transaction.accountId,
      },
    });

    if (!existingAccount)
      return {
        remaining: 0,
        updated: null,
      };

    switch (transaction.type) {
      case "CREDIT":
        return await this.creditAccount(transaction, existingAccount);
      case "DEBIT":
        return await this.debitAccount(transaction, existingAccount);
      case "TRANSFER":
        return await this.transferAccount(transaction, existingAccount);

      default:
        return {
          remaining: 0,
          updated: null,
        };
    }
  }

  public async deleteAccount() {}
}

export const accountRepository = AccountRepository.getInstance(prisma);
