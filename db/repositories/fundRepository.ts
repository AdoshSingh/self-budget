import prisma from "../prismaClient";
import Logger from "@/utils/logger";
import type { RepoResult } from "@/domain/returnTypes";

class FundRepository {
  private static instance: FundRepository;
  private dbClient: typeof prisma;
  private logger: Logger;

  private constructor(dbClient: typeof prisma) {
    this.dbClient = dbClient;
    this.logger = new Logger();
  }

  public static getInstance(dbClient: typeof prisma) {
    if (!FundRepository.instance) {
      FundRepository.instance = new FundRepository(dbClient);
    }
    return FundRepository.instance;
  }

  public async createFund(
    title: string,
    target: number,
    installment: number,
    duration: number,
    accountId: string
  ): Promise<RepoResult> {
    try {
      const account = await this.dbClient.account.findUnique({where: {id: accountId}});
      if(!account){
        return {
          status: 404,
          message: "Account not found."
        }
      }
      const newFund = await this.dbClient.fund.create({
        data: {
          title: title,
          target: target,
          installment: installment,
          duration: duration,
          accountId: accountId,
        },
      });
      if(!newFund) {
        return {
          status: 400,
          message: "Invalid request. Please try again."
        }
      }
      return {
        status: 201,
        message: 'Fund created successfully',
        data: newFund
      }
    } catch (error) {
      this.logger.error(error, 'createFund', 'FundRepository');
      return {status: 500}
    }
  }

  public async getAllFunds(accountId: string): Promise<RepoResult> {
    try {
      const account = await this.dbClient.account.findUnique({where: {id: accountId}});
      if(!account){
        return {
          status: 404,
          message: "Account not found."
        }
      }

      const existingFunds = await this.dbClient.fund.findMany({
        where: {
          accountId: accountId,
        },
      });
      return {status: 200, message: 'Funds retrieved successfully', data: existingFunds};
    } catch (error) {
      this.logger.error(error, 'getAllFunds', 'FundRepository');
      return {status: 500}
    }
  }

  public async getFund(fundId: string, accountId: string): Promise<RepoResult> {
    try {
      const existingFund = await this.dbClient.fund.findUnique({
        where: {
          id: fundId,
          accountId: accountId
        },
      });
      if (!existingFund) {
        return {status: 404, message: 'Fund not found'};
      }
      return {status: 200, message: 'Fund retrieved successfully', data: existingFund};
    } catch (error) {
      this.logger.error(error, 'getFund', 'FundRepository');
      return {status: 500};
    }
  }

  public async addMoneyInFunds(fundId: string, amount: number): Promise<RepoResult> {
    try {
      const updatedFund = await this.dbClient.fund.update({
        where: {
          id: fundId,
        },
        data: {
          balance: {
            increment: amount,
          },
        },
      });
      if(!updatedFund) {
        return {status: 404, message: 'Fund not found'};
      }
  
      return {
        status: 201,
        message: 'Added balance successfully',
        data: updatedFund
      };
    } catch (error) {
      this.logger.error(error, 'addMoneyInFunds', 'FundRepository');
      return {status: 500};
    }
  }

  public async removeMoneyFromFunds(fundId: string, amount: number): Promise<RepoResult> {
    try {
      const updatedFund = await this.dbClient.fund.update({
        where: {
          id: fundId,
          balance: {
            gte: amount,
          },
        },
        data: {
          balance: {
            decrement: amount,
          },
        },
      });
      if(!updatedFund) {
        return {status: 404, message: 'Fund not found'};
      }

      return {
        status: 201,
        message: 'Removed balance successfully',
        data: updatedFund
      };
    } catch (error) {
      this.logger.error(error, 'removeMoneyFromFunds', 'FundRepository');
      return {status: 500};
    }
  }

  public async removeFund(fundId: string): Promise<RepoResult> {
    try {
      const updated = await this.dbClient.fund.delete({
        where: {
          id: fundId
        }
      });
      return {status: 200, message:'Fund removed successfully', data: updated};
    } catch (error) {
      this.logger.error(error, 'removeFund', 'FundRepository');
      return {status: 500};
    }
  }
}

export const fundRepository = FundRepository.getInstance(prisma);
