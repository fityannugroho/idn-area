/*
  Warnings:

  - The primary key for the `districts` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `islands` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `regencies` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `villages` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "public"."districts" DROP CONSTRAINT "districts_regency_code_fkey";

-- DropForeignKey
ALTER TABLE "public"."islands" DROP CONSTRAINT "islands_regency_code_fkey";

-- DropForeignKey
ALTER TABLE "public"."villages" DROP CONSTRAINT "villages_district_code_fkey";

-- AlterTable
ALTER TABLE "public"."districts" DROP CONSTRAINT "districts_pkey",
ALTER COLUMN "code" SET DATA TYPE VARCHAR(8),
ALTER COLUMN "regency_code" SET DATA TYPE VARCHAR(5),
ADD CONSTRAINT "districts_pkey" PRIMARY KEY ("code");

-- AlterTable
ALTER TABLE "public"."islands" DROP CONSTRAINT "islands_pkey",
ALTER COLUMN "code" SET DATA TYPE VARCHAR(11),
ALTER COLUMN "regency_code" SET DATA TYPE VARCHAR(5),
ADD CONSTRAINT "islands_pkey" PRIMARY KEY ("code");

-- AlterTable
ALTER TABLE "public"."regencies" DROP CONSTRAINT "regencies_pkey",
ALTER COLUMN "code" SET DATA TYPE VARCHAR(5),
ADD CONSTRAINT "regencies_pkey" PRIMARY KEY ("code");

-- AlterTable
ALTER TABLE "public"."villages" DROP CONSTRAINT "villages_pkey",
ALTER COLUMN "code" SET DATA TYPE VARCHAR(13),
ALTER COLUMN "district_code" SET DATA TYPE VARCHAR(8),
ADD CONSTRAINT "villages_pkey" PRIMARY KEY ("code");

-- AddForeignKey
ALTER TABLE "public"."districts" ADD CONSTRAINT "districts_regency_code_fkey" FOREIGN KEY ("regency_code") REFERENCES "public"."regencies"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."islands" ADD CONSTRAINT "islands_regency_code_fkey" FOREIGN KEY ("regency_code") REFERENCES "public"."regencies"("code") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."villages" ADD CONSTRAINT "villages_district_code_fkey" FOREIGN KEY ("district_code") REFERENCES "public"."districts"("code") ON DELETE RESTRICT ON UPDATE CASCADE;
