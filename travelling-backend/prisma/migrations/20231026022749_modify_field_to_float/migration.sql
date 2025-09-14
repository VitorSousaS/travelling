/*
  Warnings:

  - Changed the type of `pricing` on the `attraction` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `minPrice` on the `establishment` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `maxPrice` on the `establishment` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "attraction" DROP COLUMN "pricing",
ADD COLUMN     "pricing" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "establishment" DROP COLUMN "minPrice",
ADD COLUMN     "minPrice" DOUBLE PRECISION NOT NULL,
DROP COLUMN "maxPrice",
ADD COLUMN     "maxPrice" DOUBLE PRECISION NOT NULL;
