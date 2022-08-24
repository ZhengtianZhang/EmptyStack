/*
  Warnings:

  - A unique constraint covering the columns `[auth0Id]` on the table `Answer` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `Answer` ADD COLUMN `auth0Id` VARCHAR(191) NOT NULL DEFAULT '';

-- CreateIndex
CREATE UNIQUE INDEX `Answer_auth0Id_key` ON `Answer`(`auth0Id`);
