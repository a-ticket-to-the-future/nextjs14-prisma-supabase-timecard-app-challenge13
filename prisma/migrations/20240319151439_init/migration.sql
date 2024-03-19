/*
  Warnings:

  - You are about to drop the column `hour` on the `Stopwatch` table. All the data in the column will be lost.
  - You are about to drop the column `minutes` on the `Stopwatch` table. All the data in the column will be lost.
  - You are about to drop the column `seconds` on the `Stopwatch` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Stopwatch" DROP COLUMN "hour",
DROP COLUMN "minutes",
DROP COLUMN "seconds";
