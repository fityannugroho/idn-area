-- CreateTable
CREATE TABLE `seeder_logs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `data_version` VARCHAR(255) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
