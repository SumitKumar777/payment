/*
  Warnings:

  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[phone]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."UserType" AS ENUM ('USER', 'MERCHANT');

-- CreateEnum
CREATE TYPE "public"."OnRampType" AS ENUM ('DEPOSIT', 'WITHDRAW');

-- CreateEnum
CREATE TYPE "public"."OnRampStatus" AS ENUM ('COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "public"."TransactionType" AS ENUM ('TRANSFER', 'PAYMENT', 'REFUND');

-- CreateEnum
CREATE TYPE "public"."TransactionStatus" AS ENUM ('SUCCESS', 'FAILED');

-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "name",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "password" TEXT NOT NULL,
ADD COLUMN     "phone" TEXT NOT NULL,
ADD COLUMN     "type" "public"."UserType" NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "username" TEXT NOT NULL,
ADD COLUMN     "wallet" BIGINT NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "public"."OnRamp" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "type" "public"."OnRampType" NOT NULL,
    "amount" BIGINT NOT NULL DEFAULT 0,
    "status" "public"."OnRampStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OnRamp_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Transaction" (
    "id" SERIAL NOT NULL,
    "fromUserId" INTEGER NOT NULL,
    "toUserId" INTEGER NOT NULL,
    "type" "public"."TransactionType" NOT NULL,
    "status" "public"."TransactionStatus" NOT NULL,
    "amount" BIGINT NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "public"."User"("phone");

-- AddForeignKey
ALTER TABLE "public"."OnRamp" ADD CONSTRAINT "OnRamp_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Transaction" ADD CONSTRAINT "Transaction_fromUserId_fkey" FOREIGN KEY ("fromUserId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Transaction" ADD CONSTRAINT "Transaction_toUserId_fkey" FOREIGN KEY ("toUserId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
