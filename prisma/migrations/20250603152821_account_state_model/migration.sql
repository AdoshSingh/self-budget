-- AlterTable
ALTER TABLE "Fund" ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "AccountState" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "accountId" TEXT NOT NULL,
    "primary_balance" DOUBLE PRECISION NOT NULL,
    "need" DOUBLE PRECISION NOT NULL,
    "want" DOUBLE PRECISION NOT NULL,
    "investment" DOUBLE PRECISION NOT NULL,
    "secondary_balance" DOUBLE PRECISION NOT NULL,
    "total_balance" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "fundSnapshot" JSONB NOT NULL,

    CONSTRAINT "AccountState_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AccountState" ADD CONSTRAINT "AccountState_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
