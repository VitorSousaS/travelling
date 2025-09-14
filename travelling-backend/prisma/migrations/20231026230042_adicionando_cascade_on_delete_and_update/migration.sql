-- DropForeignKey
ALTER TABLE "contract" DROP CONSTRAINT "contract_agencyId_fkey";

-- DropForeignKey
ALTER TABLE "contract" DROP CONSTRAINT "contract_attractionId_fkey";

-- DropForeignKey
ALTER TABLE "contract" DROP CONSTRAINT "contract_touristId_fkey";

-- AddForeignKey
ALTER TABLE "contract" ADD CONSTRAINT "contract_touristId_fkey" FOREIGN KEY ("touristId") REFERENCES "tourists"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contract" ADD CONSTRAINT "contract_agencyId_fkey" FOREIGN KEY ("agencyId") REFERENCES "agencies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contract" ADD CONSTRAINT "contract_attractionId_fkey" FOREIGN KEY ("attractionId") REFERENCES "attraction"("id") ON DELETE CASCADE ON UPDATE CASCADE;
