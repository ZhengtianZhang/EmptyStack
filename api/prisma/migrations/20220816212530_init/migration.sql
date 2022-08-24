/*
  Warnings:

  - You are about to drop the column `quesntionId` on the `Answer` table. All the data in the column will be lost.
  - Added the required column `questionId` to the `Answer` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Answer` DROP FOREIGN KEY `Answer_quesntionId_fkey`;

-- AlterTable
ALTER TABLE `Answer` DROP COLUMN `quesntionId`,
    ADD COLUMN `questionId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Answer` ADD CONSTRAINT `Answer_questionId_fkey` FOREIGN KEY (`questionId`) REFERENCES `Question`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
