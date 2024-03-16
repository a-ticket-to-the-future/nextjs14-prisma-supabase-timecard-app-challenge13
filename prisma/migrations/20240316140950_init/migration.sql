/*
  Warnings:

  - You are about to drop the column `subtotal` on the `Timecard` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Timecard" DROP COLUMN "subtotal",
ADD COLUMN     "subTotal" TIMESTAMP(3);
