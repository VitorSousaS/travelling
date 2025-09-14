-- DropForeignKey
ALTER TABLE "local" DROP CONSTRAINT "local_attractionId_fkey";

-- DropForeignKey
ALTER TABLE "local" DROP CONSTRAINT "local_establishmentId_fkey";

-- DropForeignKey
ALTER TABLE "local" DROP CONSTRAINT "local_travellingId_fkey";

-- AddForeignKey
ALTER TABLE "local" ADD CONSTRAINT "local_attractionId_fkey" FOREIGN KEY ("attractionId") REFERENCES "attraction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "local" ADD CONSTRAINT "local_establishmentId_fkey" FOREIGN KEY ("establishmentId") REFERENCES "establishment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "local" ADD CONSTRAINT "local_travellingId_fkey" FOREIGN KEY ("travellingId") REFERENCES "travelling"("id") ON DELETE CASCADE ON UPDATE CASCADE;
