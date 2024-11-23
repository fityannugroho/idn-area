-- CreateTable
CREATE TABLE "seeder_logs" (
    "id" SERIAL NOT NULL,
    "data_version" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "seeder_logs_pkey" PRIMARY KEY ("id")
);
