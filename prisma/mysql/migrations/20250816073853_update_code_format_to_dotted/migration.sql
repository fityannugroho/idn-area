/*
  Warnings:

  - The primary key for the `districts` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `islands` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `regencies` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `villages` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE `districts` DROP FOREIGN KEY `districts_regency_code_fkey`;

-- DropForeignKey
ALTER TABLE `islands` DROP FOREIGN KEY `islands_regency_code_fkey`;

-- DropForeignKey
ALTER TABLE `villages` DROP FOREIGN KEY `villages_district_code_fkey`;

-- DropIndex
DROP INDEX `districts_regency_code_fkey` ON `districts`;

-- DropIndex
DROP INDEX `islands_regency_code_fkey` ON `islands`;

-- DropIndex
DROP INDEX `villages_district_code_fkey` ON `villages`;

-- AlterTable
ALTER TABLE `districts` DROP PRIMARY KEY,
    MODIFY `code` VARCHAR(8) NOT NULL,
    MODIFY `regency_code` VARCHAR(5) NOT NULL,
    ADD PRIMARY KEY (`code`);

-- AlterTable
ALTER TABLE `islands` DROP PRIMARY KEY,
    MODIFY `code` VARCHAR(11) NOT NULL,
    MODIFY `regency_code` VARCHAR(5) NULL,
    ADD PRIMARY KEY (`code`);

-- AlterTable
ALTER TABLE `regencies` DROP PRIMARY KEY,
    MODIFY `code` VARCHAR(5) NOT NULL,
    ADD PRIMARY KEY (`code`);

-- AlterTable
ALTER TABLE `villages` DROP PRIMARY KEY,
    MODIFY `code` VARCHAR(13) NOT NULL,
    MODIFY `district_code` VARCHAR(8) NOT NULL,
    ADD PRIMARY KEY (`code`);

-- AddForeignKey
ALTER TABLE `districts` ADD CONSTRAINT `districts_regency_code_fkey` FOREIGN KEY (`regency_code`) REFERENCES `regencies`(`code`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `islands` ADD CONSTRAINT `islands_regency_code_fkey` FOREIGN KEY (`regency_code`) REFERENCES `regencies`(`code`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `villages` ADD CONSTRAINT `villages_district_code_fkey` FOREIGN KEY (`district_code`) REFERENCES `districts`(`code`) ON DELETE RESTRICT ON UPDATE CASCADE;
