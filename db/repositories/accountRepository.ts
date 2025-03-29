import prisma from "../prismaClient";
import type { Account, Transaction } from "@/domain/prismaTypes";
import { ReturnUpdatedAccount } from "@/domain/returnTypes";
import { fundRepository } from "./fundRepository";
import userRepository from "./userRepository";

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
    userId: string
  ) {
    try {
      const userExists = (await userRepository.findUser(userId)).data;
      if (!userExists) {
        return { status: 400, message: 'User does not exist' };
      }
  
      const accountExists = await this.dbClient.account.findUnique({ where: { userId: userId } });
      if (accountExists) {
        return { status: 409, message: 'Account already exists for this user.'};
      }
  
      if (isNaN(primary_balance) || primary_balance < 0) {
        return { status: 400, message: 'Invalid primary balance.' }
      }
      if (isNaN(secondary_balance) || secondary_balance < 0) {
        return { status: 400, message: 'Invalid secondary balance.' }
      }
  
      const newAccount = await this.dbClient.account.create({
        data: {
          primary_balance: primary_balance,
          need: (primary_balance * 50) / 100,
          want: (primary_balance * 30) / 100,
          investment: (primary_balance * 20) / 100,
          secondary_balance: secondary_balance,
          userId: userId,
        },
      });
      return {status: 201, message: 'Account added successfully', data: newAccount}
    } catch (error) {
      console.error('Error in createAccount repo -> ', error);
      return { status: 500 }
    }
  }

  public async getAccount(userId: string) {
    try {
      const userExists = (await userRepository.findUser(userId)).data;
      if (!userExists) {
        return { status: 400, message: 'User does not exist' };
      }
  
      const existingAccount = await prisma.account.findUnique({
        where: {
          userId: userId,
        },
      });
      if(!existingAccount) {
        return { status: 404, message: 'Account does not exist.'};
      }
      return { status: 200, data: existingAccount};
    } catch (error) {
      console.error('Error in getAccount repo -> ', error);
      return { status: 500 }
    }
  }

  private async creditAccount(
    transaction: Partial<Transaction>,
    account: Account,
    fundId?: string
  ): Promise<ReturnUpdatedAccount> {
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

      case "REFUND":
        switch (transaction.payee) {
          case "NEED":
            const updated3 = await this.dbClient.account.update({
              where: {
                id: account.id,
              },
              data: {
                primary_balance: account.primary_balance + newPrice,
                need: account.need + newPrice,
              },
            });
            return {
              remaining: 0,
              updated: updated3,
            };

          case "WANT":
            const updated4 = await this.dbClient.account.update({
              where: {
                id: account.id,
              },
              data: {
                primary_balance: account.primary_balance + newPrice,
                want: account.want + newPrice,
              },
            });
            return {
              remaining: 0,
              updated: updated4,
            };

          case "INVEST":
            const updated5 = await this.dbClient.account.update({
              where: {
                id: account.id,
              },
              data: {
                primary_balance: account.primary_balance + newPrice,
                investment: account.investment + newPrice,
              },
            });
            return {
              remaining: 0,
              updated: updated5,
            };

          case "SECONDARY":
            const updated6 = await this.dbClient.account.update({
              where: {
                id: account.id,
              },
              data: {
                secondary_balance: account.secondary_balance + newPrice,
              },
            });
            return {
              remaining: 0,
              updated: updated6,
            };

          case "FUNDS":
            if (!fundId)
              return {
                remaining: 0,
                updated: null,
              };
            const updated7 = await fundRepository.addMoneyInFunds(
              fundId,
              newPrice
            );
            return {
              remaining: 0,
              updated: account,
            };
        }

      default:
        return {
          remaining: 0,
          updated: null,
        };
    }
  }

  private async debitAccount(
    transaction: Partial<Transaction>,
    account: Account,
    fundId?: string
  ): Promise<ReturnUpdatedAccount> {
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
        if (!fundId)
          return {
            remaining: 0,
            updated: null,
          };

        const udpatedFund = await fundRepository.removeMoneyFromFunds(
          fundId,
          amount
        );

        if (transaction.payee === 'NEED') {
          await this.dbClient.account.update({
            where: {
              id: account.id
            },
            data: {
              primary_balance: account.primary_balance + amount,
              need: account.need + amount
            }
          });
        } else if (transaction.payee === 'WANT') {
          await this.dbClient.account.update({
            where: {
              id: account.id,
            },
            data: {
              primary_balance: account.primary_balance + amount,
              want: account.want + amount,
            }
          });
        }

        return {
          remaining: 0,
          updated: account,
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
    account: Account,
    fundId?: string
  ): Promise<ReturnUpdatedAccount> {
    const amount = transaction.amount;
    if (!amount)
      return {
        remaining: 0,
        updated: null,
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
        if (!fundId)
          return {
            remaining: 0,
            updated: null,
          };
        let updated2;
        if (transaction.payer === "NEED") {
          updated2 = await this.dbClient.account.update({
            where: {
              id: account.id,
            },
            data: {
              primary_balance: {
                decrement: amount,
              },
              need: {
                decrement: amount,
              },
            },
          });
        } else {
          updated2 = await this.dbClient.account.update({
            where: {
              id: account.id,
            },
            data: {
              primary_balance: {
                decrement: amount,
              },
              want: {
                decrement: amount,
              },
            },
          });
        }
        const updatedFund = await fundRepository.addMoneyInFunds(
          fundId,
          amount
        );
        return {
          remaining: 0,
          updated: updated2,
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
          } else if (existingWant === 0 && fundId) {
            const existingFund = await fundRepository.getFund(fundId);
            if (!existingFund)
              return {
                remaining: 0,
                updated: null,
              };

            const existingFundBalance = existingFund.balance;
            let updatedFund;
            if (existingFundBalance >= amount) {
              updatedFund = await fundRepository.removeMoneyFromFunds(
                fundId,
                amount
              );
              const updatedAcc = await this.dbClient.account.update({
                where: {
                  id: account.id,
                },
                data: {
                  primary_balance: {
                    increment: amount,
                  },
                  need: {
                    increment: amount,
                  },
                },
              });
              return {
                remaining: 0,
                updated: updatedAcc,
              };
            } else {
              updatedFund = await fundRepository.removeMoneyFromFunds(
                fundId,
                existingFundBalance
              );
              const updatedAcc = await this.dbClient.account.update({
                where: {
                  id: account.id,
                },
                data: {
                  primary_balance: {
                    increment: existingFundBalance,
                  },
                  need: {
                    increment: existingFundBalance,
                  },
                },
              });
              return {
                remaining: amount - existingFundBalance,
                updated: updatedAcc,
              };
            }
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
          if (fundId) {
            const existingFund = await fundRepository.getFund(fundId);
            if (!existingFund)
              return {
                remaining: 0,
                updated: null,
              };

            const existingFundBalance = existingFund.balance;
            let updatedFund;
            if (existingFundBalance >= amount) {
              updatedFund = await fundRepository.removeMoneyFromFunds(
                fundId,
                amount
              );
              const updatedAcc = await this.dbClient.account.update({
                where: {
                  id: account.id,
                },
                data: {
                  primary_balance: {
                    increment: amount,
                  },
                  want: {
                    increment: amount,
                  },
                },
              });
              return {
                remaining: 0,
                updated: updatedAcc,
              };
            } else {
              updatedFund = await fundRepository.removeMoneyFromFunds(
                fundId,
                existingFundBalance
              );
              const updatedAcc = await this.dbClient.account.update({
                where: {
                  id: account.id,
                },
                data: {
                  primary_balance: {
                    increment: existingFundBalance,
                  },
                  want: {
                    increment: existingFundBalance,
                  },
                },
              });
              return {
                remaining: amount - existingFundBalance,
                updated: updatedAcc,
              };
            }
          } else {
            const updated2 = await this.dbClient.account.update({
              where: {
                id: account.id,
              },
              data: {
                primary_balance: account.primary_balance + amount,
                want: existingWant + amount,
                secondary_balance: existingSecondary - amount,
                penalty: account.penalty + amount,
              },
            });
            return {
              remaining: 0,
              updated: updated2,
            };
          }
        } else if (transaction.payee === "INVEST") {
          const updated2 = await this.dbClient.account.update({
            where: {
              id: account.id,
            },
            data: {
              primary_balance: account.primary_balance + amount,
              investment: account.investment + amount,
              secondary_balance: existingSecondary - amount,
              penalty: account.penalty + amount,
            },
          });
          return {
            remaining: 0,
            updated: updated2,
          };
        }
        return {
          remaining: 0,
          updated: null,
        };

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

  public async updateAccount(
    transaction: Partial<Transaction>,
    fundId?: string
  ): Promise<ReturnUpdatedAccount> {
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
        return await this.creditAccount(transaction, existingAccount, fundId);
      case "DEBIT":
        return await this.debitAccount(transaction, existingAccount, fundId);
      case "TRANSFER":
        return await this.transferAccount(transaction, existingAccount, fundId);

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
