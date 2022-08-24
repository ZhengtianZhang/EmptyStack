/*
  Warnings:

  - You are about to drop the column `auth0Id` on the `Answer` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `Answer_auth0Id_key` ON `Answer`;

-- AlterTable
ALTER TABLE `Answer` DROP COLUMN `auth0Id`;
