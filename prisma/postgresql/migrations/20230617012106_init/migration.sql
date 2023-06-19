-- CreateTable
CREATE TABLE "districts" (
    "code" VARCHAR(6) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "regency_code" VARCHAR(4) NOT NULL,

    CONSTRAINT "districts_pkey" PRIMARY KEY ("code")
);

-- CreateTable
CREATE TABLE "islands" (
    "code" VARCHAR(9) NOT NULL,
    "coordinate" VARCHAR(30) NOT NULL,
    "is_outermost_small" BOOLEAN NOT NULL,
    "is_populated" BOOLEAN NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "regency_code" VARCHAR(4),

    CONSTRAINT "islands_pkey" PRIMARY KEY ("code")
);

-- CreateTable
CREATE TABLE "provinces" (
    "code" VARCHAR(2) NOT NULL,
    "name" VARCHAR(255) NOT NULL,

    CONSTRAINT "provinces_pkey" PRIMARY KEY ("code")
);

-- CreateTable
CREATE TABLE "regencies" (
    "code" VARCHAR(4) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "province_code" VARCHAR(2) NOT NULL,

    CONSTRAINT "regencies_pkey" PRIMARY KEY ("code")
);

-- CreateTable
CREATE TABLE "villages" (
    "code" VARCHAR(10) NOT NULL,
    "district_code" VARCHAR(6) NOT NULL,
    "name" VARCHAR(255) NOT NULL,

    CONSTRAINT "villages_pkey" PRIMARY KEY ("code")
);

-- AddForeignKey
ALTER TABLE "districts" ADD CONSTRAINT "districts_regency_code_fkey" FOREIGN KEY ("regency_code") REFERENCES "regencies"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "islands" ADD CONSTRAINT "islands_regency_code_fkey" FOREIGN KEY ("regency_code") REFERENCES "regencies"("code") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "regencies" ADD CONSTRAINT "regencies_province_code_fkey" FOREIGN KEY ("province_code") REFERENCES "provinces"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "villages" ADD CONSTRAINT "villages_district_code_fkey" FOREIGN KEY ("district_code") REFERENCES "districts"("code") ON DELETE RESTRICT ON UPDATE CASCADE;
