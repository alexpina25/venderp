/*
  Warnings:

  - A unique constraint covering the columns `[customId]` on the table `Client` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[customId]` on the table `Machine` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[serialNumber]` on the table `Machine` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[customId]` on the table `Product` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `clientId` to the `Machine` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `MachineProduct` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "MachineType" ADD VALUE 'CAFE';

-- DropForeignKey
ALTER TABLE "Machine" DROP CONSTRAINT "Machine_locationId_fkey";

-- AlterTable
ALTER TABLE "Client" ADD COLUMN     "customId" INTEGER;

-- AlterTable
ALTER TABLE "Machine" ADD COLUMN     "clientId" TEXT NOT NULL,
ADD COLUMN     "customId" INTEGER;

-- AlterTable
ALTER TABLE "MachineProduct" ADD COLUMN     "price" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "customId" INTEGER;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "dashboardWidgets" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- CreateTable
CREATE TABLE "Location" (
    "id" TEXT NOT NULL,
    "customId" INTEGER,
    "clientId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "postalCode" TEXT,
    "province" TEXT,
    "country" TEXT DEFAULT 'España',
    "contactName" TEXT,
    "contactPhone" TEXT,
    "contactEmail" TEXT,
    "notes" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Location_customId_key" ON "Location"("customId");

-- CreateIndex
CREATE UNIQUE INDEX "Client_customId_key" ON "Client"("customId");

-- CreateIndex
CREATE UNIQUE INDEX "Machine_customId_key" ON "Machine"("customId");

-- CreateIndex
CREATE UNIQUE INDEX "Machine_serialNumber_key" ON "Machine"("serialNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Product_customId_key" ON "Product"("customId");

-- AddForeignKey
ALTER TABLE "Location" ADD CONSTRAINT "Location_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Machine" ADD CONSTRAINT "Machine_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Machine" ADD CONSTRAINT "Machine_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
