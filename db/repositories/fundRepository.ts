import prisma from "../prismaClient";

class FundRepository {
  private static instance: FundRepository;
  private dbClient: typeof prisma;

  private constructor(dbClient: typeof prisma) {
    this.dbClient = dbClient;
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
  ) {
    const newFund = await this.dbClient.fund.create({
      data: {
        title: title,
        target: target,
        installment: installment,
        duration: duration,
        accountId: accountId,
      },
    });
    return newFund;
  }

  public async getAllFunds(accountId: string) {
    const existingFunds = await this.dbClient.fund.findMany({
      where: {
        accountId: accountId,
      },
    });
    return existingFunds;
  }

  public async getFund(fundId: string) {
    return await this.dbClient.fund.findUnique({
      where: {
        id: fundId,
      },
    });
  }

  public async addMoneyInFunds(fundId: string, amount: number) {
    const udpatedFund = await this.dbClient.fund.update({
      where: {
        id: fundId,
      },
      data: {
        balance: {
          increment: amount,
        },
      },
    });

    return udpatedFund;
  }

  public async removeMoneyFromFunds(fundId: string, amount: number) {
    const updated = await this.dbClient.fund.update({
      where: {
        id: fundId,
      },
      data: {
        balance: {
          decrement: amount,
        },
      },
    });

    return updated;
  }
}

export const fundRepository = FundRepository.getInstance(prisma);
