-- AlterTable
ALTER TABLE "ActivityLog" ADD COLUMN     "customId" INTEGER;

-- AlterTable
ALTER TABLE "Center" ADD COLUMN     "customId" INTEGER,
ADD COLUMN     "isParent" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "contactName" DROP NOT NULL,
ALTER COLUMN "contactPhone" DROP NOT NULL;

-- AlterTable
ALTER TABLE "CenterUser" ADD COLUMN     "customId" INTEGER;

-- AlterTable
ALTER TABLE "Invoice" ADD COLUMN     "customId" INTEGER;

-- AlterTable
ALTER TABLE "Machine" ADD COLUMN     "brand" TEXT,
ADD COLUMN     "centerId" TEXT;

-- AlterTable
ALTER TABLE "MachineProduct" ADD COLUMN     "customId" INTEGER;

-- AlterTable
ALTER TABLE "MaintenanceLog" ADD COLUMN     "customId" INTEGER;

-- AlterTable
ALTER TABLE "Master" ADD COLUMN     "customId" INTEGER;

-- AlterTable
ALTER TABLE "POS" ADD COLUMN     "customId" INTEGER;

-- AlterTable
ALTER TABLE "POSUser" ADD COLUMN     "customId" INTEGER;

-- AlterTable
ALTER TABLE "Replenishment" ADD COLUMN     "customId" INTEGER;

-- AlterTable
ALTER TABLE "ReplenishmentItem" ADD COLUMN     "customId" INTEGER,
ADD COLUMN     "quantityExpired" INTEGER;

-- AlterTable
ALTER TABLE "Route" ADD COLUMN     "customId" INTEGER;

-- AlterTable
ALTER TABLE "Sale" ADD COLUMN     "customId" INTEGER;

-- AlterTable
ALTER TABLE "Tenant" ADD COLUMN     "customId" INTEGER;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "customId" INTEGER;

-- CreateTable
CREATE TABLE "RouteStop" (
    "id" TEXT NOT NULL,
    "customId" INTEGER,
    "routeId" TEXT NOT NULL,
    "posId" TEXT NOT NULL,
    "cashCollected" DOUBLE PRECISION,
    "walletReload" DOUBLE PRECISION,
    "maintenanceNotes" TEXT,
    "priceChangeNotes" TEXT,
    "notes" TEXT,

    CONSTRAINT "RouteStop_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Counter" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "lastValue" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Counter_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Counter_tenantId_model_key" ON "Counter"("tenantId", "model");

-- AddForeignKey
ALTER TABLE "Machine" ADD CONSTRAINT "Machine_centerId_fkey" FOREIGN KEY ("centerId") REFERENCES "Center"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RouteStop" ADD CONSTRAINT "RouteStop_routeId_fkey" FOREIGN KEY ("routeId") REFERENCES "Route"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RouteStop" ADD CONSTRAINT "RouteStop_posId_fkey" FOREIGN KEY ("posId") REFERENCES "POS"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Counter" ADD CONSTRAINT "Counter_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
