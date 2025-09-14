-- DropForeignKey
ALTER TABLE "local" DROP CONSTRAINT "local_travellingId_fkey";

-- AddForeignKey
ALTER TABLE "local" ADD CONSTRAINT "local_travellingId_fkey" FOREIGN KEY ("travellingId") REFERENCES "travelling"("id") ON DELETE SET NULL ON UPDATE CASCADE;
