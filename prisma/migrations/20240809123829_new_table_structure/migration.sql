/*
  Warnings:

  - The values [SAVINGS,PRIMARY] on the enum `BracketType` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `penalty` to the `Account` table without a default value. This is not possible if the table is not empty.
  - Added the required column `payer` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "BracketType_new" AS ENUM ('INCOME', 'UNREGULATED', 'NEED', 'WANT', 'INVEST', 'FUND_DEBIT', 'SURPLUS', 'FUND_TRANSFER', 'INTERNAL', 'PENALTY');
ALTER TABLE "Transaction" ALTER COLUMN "bracket" TYPE "BracketType_new" USING ("bracket"::text::"BracketType_new");
ALTER TYPE "BracketType" RENAME TO "BracketType_old";
ALTER TYPE "BracketType_new" RENAME TO "BracketType";
DROP TYPE "BracketType_old";
COMMIT;

-- AlterEnum
ALTER TYPE "TransactionType" ADD VALUE 'TRANSFER';

-- AlterTable
ALTER TABLE "Account" ADD COLUMN     "penalty" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "payer" TEXT NOT NULL;
