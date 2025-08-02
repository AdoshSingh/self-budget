-- CreateEnum
CREATE TYPE "FundDeposit" AS ENUM ('ACCOUNT', 'FUND');

-- AlterTable
ALTER TABLE "Fund" ADD COLUMN     "depositName" TEXT NOT NULL DEFAULT 'ACCOUNT',
ADD COLUMN     "depositType" "FundDeposit" NOT NULL DEFAULT 'ACCOUNT';

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "spendingAccountId" TEXT;

-- CreateTable
CREATE TABLE "AccountConfig" (
    "id" TEXT NOT NULL,
    "splitNeed" DOUBLE PRECISION NOT NULL DEFAULT 50,
    "splitWant" DOUBLE PRECISION NOT NULL DEFAULT 30,
    "splitInvest" DOUBLE PRECISION NOT NULL DEFAULT 20,
    "accountId" TEXT NOT NULL,

    CONSTRAINT "AccountConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SpendingAccount" (
    "id" TEXT NOT NULL,
    "bankName" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "balance" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "SpendingAccount_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AccountConfig_accountId_key" ON "AccountConfig"("accountId");

-- AddForeignKey
ALTER TABLE "AccountConfig" ADD CONSTRAINT "AccountConfig_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpendingAccount" ADD CONSTRAINT "SpendingAccount_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_spendingAccountId_fkey" FOREIGN KEY ("spendingAccountId") REFERENCES "SpendingAccount"("id") ON DELETE SET NULL ON UPDATE CASCADE;
