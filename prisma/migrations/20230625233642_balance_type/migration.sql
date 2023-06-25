/*
  Warnings:

  - You are about to drop the column `balnaceType` on the `Balance` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Balance" DROP COLUMN "balnaceType",
ADD COLUMN     "balanceType" "BalanceType" NOT NULL DEFAULT 'INCOME';
