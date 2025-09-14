-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'AGENCY', 'TOURIST', 'BUSINESS');

-- CreateEnum
CREATE TYPE "ContractStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELED', 'FINISHED');

-- CreateEnum
CREATE TYPE "LocalType" AS ENUM ('establishment', 'attraction');

-- CreateTable
CREATE TABLE "categories" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "userRole" "UserRole" NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tourists" (
    "id" TEXT NOT NULL DEFAULT 'user',
    "lastname" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "tourists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "agencies" (
    "id" TEXT NOT NULL DEFAULT 'user',
    "userId" TEXT NOT NULL,

    CONSTRAINT "agencies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "businesses" (
    "id" TEXT NOT NULL DEFAULT 'user',
    "userId" TEXT NOT NULL,

    CONSTRAINT "businesses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "establishment" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "type" "LocalType" NOT NULL DEFAULT 'establishment',
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "banner" TEXT NOT NULL,
    "openHours" TIMESTAMP NOT NULL,
    "closeHours" TIMESTAMP NOT NULL,
    "location" TEXT NOT NULL,
    "minPrice" TEXT NOT NULL,
    "maxPrice" TEXT NOT NULL,
    "openDays" TEXT[],
    "foundInEstablishment" TEXT NOT NULL,
    "otherInformation" TEXT NOT NULL,
    "phone" TEXT,
    "generalMedias" TEXT[],
    "menuOfServicesMedia" TEXT[],
    "averageRating" DOUBLE PRECISION NOT NULL DEFAULT 5,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "establishment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attraction" (
    "id" TEXT NOT NULL,
    "agencyId" TEXT NOT NULL,
    "type" "LocalType" NOT NULL DEFAULT 'attraction',
    "name" TEXT NOT NULL,
    "pricing" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "date" TIMESTAMP NOT NULL,
    "description" TEXT NOT NULL,
    "foundInAttraction" TEXT NOT NULL,
    "notFoundInAttraction" TEXT NOT NULL,
    "whatToTake" TEXT[],
    "banner" TEXT NOT NULL,
    "generalMedias" TEXT[],
    "averageRating" DOUBLE PRECISION NOT NULL DEFAULT 5,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "attraction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "travelling" (
    "id" TEXT NOT NULL,
    "touristId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "travelling_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "local" (
    "id" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "type" "LocalType",
    "attractionId" TEXT,
    "establishmentId" TEXT,
    "travellingId" TEXT,

    CONSTRAINT "local_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ratingToAttraction" (
    "id" TEXT NOT NULL,
    "touristId" TEXT,
    "attractionId" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL DEFAULT 5,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ratingToAttraction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ratingToEstablishment" (
    "id" TEXT NOT NULL,
    "touristId" TEXT,
    "establishmentId" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL DEFAULT 5,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ratingToEstablishment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contract" (
    "id" TEXT NOT NULL,
    "touristId" TEXT NOT NULL,
    "agencyId" TEXT NOT NULL,
    "attractionId" TEXT NOT NULL,
    "status" "ContractStatus" NOT NULL DEFAULT 'PENDING',
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "contract_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CategoryToTourist" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_CategoryToEstablishment" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_AttractionToCategory" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "categories_title_key" ON "categories"("title");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_key" ON "users"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "tourists_userId_key" ON "tourists"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "agencies_userId_key" ON "agencies"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "businesses_userId_key" ON "businesses"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "establishment_location_key" ON "establishment"("location");

-- CreateIndex
CREATE UNIQUE INDEX "establishment_phone_key" ON "establishment"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "attraction_location_key" ON "attraction"("location");

-- CreateIndex
CREATE UNIQUE INDEX "_CategoryToTourist_AB_unique" ON "_CategoryToTourist"("A", "B");

-- CreateIndex
CREATE INDEX "_CategoryToTourist_B_index" ON "_CategoryToTourist"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CategoryToEstablishment_AB_unique" ON "_CategoryToEstablishment"("A", "B");

-- CreateIndex
CREATE INDEX "_CategoryToEstablishment_B_index" ON "_CategoryToEstablishment"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_AttractionToCategory_AB_unique" ON "_AttractionToCategory"("A", "B");

-- CreateIndex
CREATE INDEX "_AttractionToCategory_B_index" ON "_AttractionToCategory"("B");

-- AddForeignKey
ALTER TABLE "tourists" ADD CONSTRAINT "tourists_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agencies" ADD CONSTRAINT "agencies_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "businesses" ADD CONSTRAINT "businesses_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "establishment" ADD CONSTRAINT "establishment_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "businesses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attraction" ADD CONSTRAINT "attraction_agencyId_fkey" FOREIGN KEY ("agencyId") REFERENCES "agencies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "travelling" ADD CONSTRAINT "travelling_touristId_fkey" FOREIGN KEY ("touristId") REFERENCES "tourists"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "local" ADD CONSTRAINT "local_attractionId_fkey" FOREIGN KEY ("attractionId") REFERENCES "attraction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "local" ADD CONSTRAINT "local_establishmentId_fkey" FOREIGN KEY ("establishmentId") REFERENCES "establishment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "local" ADD CONSTRAINT "local_travellingId_fkey" FOREIGN KEY ("travellingId") REFERENCES "travelling"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ratingToAttraction" ADD CONSTRAINT "ratingToAttraction_touristId_fkey" FOREIGN KEY ("touristId") REFERENCES "tourists"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ratingToAttraction" ADD CONSTRAINT "ratingToAttraction_attractionId_fkey" FOREIGN KEY ("attractionId") REFERENCES "attraction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ratingToEstablishment" ADD CONSTRAINT "ratingToEstablishment_touristId_fkey" FOREIGN KEY ("touristId") REFERENCES "tourists"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ratingToEstablishment" ADD CONSTRAINT "ratingToEstablishment_establishmentId_fkey" FOREIGN KEY ("establishmentId") REFERENCES "establishment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contract" ADD CONSTRAINT "contract_touristId_fkey" FOREIGN KEY ("touristId") REFERENCES "tourists"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contract" ADD CONSTRAINT "contract_agencyId_fkey" FOREIGN KEY ("agencyId") REFERENCES "agencies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contract" ADD CONSTRAINT "contract_attractionId_fkey" FOREIGN KEY ("attractionId") REFERENCES "attraction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryToTourist" ADD CONSTRAINT "_CategoryToTourist_A_fkey" FOREIGN KEY ("A") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryToTourist" ADD CONSTRAINT "_CategoryToTourist_B_fkey" FOREIGN KEY ("B") REFERENCES "tourists"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryToEstablishment" ADD CONSTRAINT "_CategoryToEstablishment_A_fkey" FOREIGN KEY ("A") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryToEstablishment" ADD CONSTRAINT "_CategoryToEstablishment_B_fkey" FOREIGN KEY ("B") REFERENCES "establishment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AttractionToCategory" ADD CONSTRAINT "_AttractionToCategory_A_fkey" FOREIGN KEY ("A") REFERENCES "attraction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AttractionToCategory" ADD CONSTRAINT "_AttractionToCategory_B_fkey" FOREIGN KEY ("B") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;
