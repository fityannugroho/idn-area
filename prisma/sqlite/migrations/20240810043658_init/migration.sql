-- CreateTable
CREATE TABLE "districts" (
    "code" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "regency_code" TEXT NOT NULL,
    CONSTRAINT "districts_regency_code_fkey" FOREIGN KEY ("regency_code") REFERENCES "regencies" ("code") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "islands" (
    "code" TEXT NOT NULL PRIMARY KEY,
    "coordinate" TEXT NOT NULL,
    "is_outermost_small" BOOLEAN NOT NULL,
    "is_populated" BOOLEAN NOT NULL,
    "name" TEXT NOT NULL,
    "regency_code" TEXT,
    CONSTRAINT "islands_regency_code_fkey" FOREIGN KEY ("regency_code") REFERENCES "regencies" ("code") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "provinces" (
    "code" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "regencies" (
    "code" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "province_code" TEXT NOT NULL,
    CONSTRAINT "regencies_province_code_fkey" FOREIGN KEY ("province_code") REFERENCES "provinces" ("code") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "villages" (
    "code" TEXT NOT NULL PRIMARY KEY,
    "district_code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    CONSTRAINT "villages_district_code_fkey" FOREIGN KEY ("district_code") REFERENCES "districts" ("code") ON DELETE RESTRICT ON UPDATE CASCADE
);
