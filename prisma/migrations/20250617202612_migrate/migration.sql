-- CreateEnum
CREATE TYPE "Role" AS ENUM ('SUPERADMIN', 'TENANT_ADMIN', 'TENANT_USER', 'CENTER_MANAGER', 'CENTER_USER', 'POS_USER');

-- CreateEnum
CREATE TYPE "MachineType" AS ENUM ('SNACK', 'DRINK', 'COMBO', 'CAFE', 'OTHER');

-- CreateEnum
CREATE TYPE "MachineStatus" AS ENUM ('ACTIVE', 'OUT_OF_SERVICE', 'RETIRED');

-- CreateEnum
CREATE TYPE "ProductCategory" AS ENUM ('SNACK', 'DRINK', 'COMBO', 'OTHER');

-- CreateEnum
CREATE TYPE "MaintenanceType" AS ENUM ('PREVENTIVE', 'CORRECTIVE', 'INSPECTION');

-- CreateEnum
CREATE TYPE "InvoiceStatus" AS ENUM ('PENDING', 'PAID', 'CANCELLED', 'OVERDUE');

-- CreateEnum
CREATE TYPE "SaleMethod" AS ENUM ('COIN', 'BILL', 'CARD');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "tenantId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tenant" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Tenant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CenterUser" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "centerId" TEXT NOT NULL,

    CONSTRAINT "CenterUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "POSUser" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "posId" TEXT NOT NULL,

    CONSTRAINT "POSUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Center" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "postalCode" TEXT,
    "province" TEXT,
    "country" TEXT,
    "contactName" TEXT NOT NULL,
    "contactPhone" TEXT NOT NULL,
    "contactEmail" TEXT,
    "notes" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "tenantId" TEXT NOT NULL,
    "parentCenterId" TEXT,

    CONSTRAINT "Center_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "POS" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "postalCode" TEXT,
    "province" TEXT,
    "country" TEXT,
    "contactName" TEXT,
    "contactPhone" TEXT,
    "contactEmail" TEXT,
    "notes" TEXT,
    "centerId" TEXT NOT NULL,
    "coverage" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "POS_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Master" (
    "id" TEXT NOT NULL,
    "serialNumber" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "posId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Master_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Machine" (
    "id" TEXT NOT NULL,
    "customId" INTEGER,
    "code" TEXT NOT NULL,
    "model" TEXT,
    "serialNumber" TEXT,
    "type" "MachineType" NOT NULL,
    "status" "MachineStatus" NOT NULL DEFAULT 'ACTIVE',
    "lastCheck" TIMESTAMP(3),
    "installedAt" TIMESTAMP(3),
    "centerId" TEXT NOT NULL,
    "posId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Machine_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "customId" INTEGER,
    "name" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "category" "ProductCategory" NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "cost" DOUBLE PRECISION,
    "unit" TEXT NOT NULL,
    "imageUrl" TEXT,
    "stockMin" INTEGER,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MachineProduct" (
    "id" TEXT NOT NULL,
    "machineId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "currentStock" INTEGER NOT NULL,
    "maxCapacity" INTEGER NOT NULL,
    "minThreshold" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "line" TEXT NOT NULL,
    "selection" TEXT NOT NULL,

    CONSTRAINT "MachineProduct_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Replenishment" (
    "id" TEXT NOT NULL,
    "machineId" TEXT NOT NULL,
    "routeId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notes" TEXT,

    CONSTRAINT "Replenishment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReplenishmentItem" (
    "id" TEXT NOT NULL,
    "replenishmentId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "quantityAdded" INTEGER NOT NULL,
    "stockBefore" INTEGER NOT NULL,
    "stockAfter" INTEGER NOT NULL,

    CONSTRAINT "ReplenishmentItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MaintenanceLog" (
    "id" TEXT NOT NULL,
    "machineId" TEXT NOT NULL,
    "operatorId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" "MaintenanceType" NOT NULL,
    "description" TEXT NOT NULL,
    "cost" DOUBLE PRECISION,
    "durationMin" INTEGER,
    "resolved" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "MaintenanceLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Route" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "operatorId" TEXT NOT NULL,
    "notes" TEXT,

    CONSTRAINT "Route_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Invoice" (
    "id" TEXT NOT NULL,
    "centerId" TEXT NOT NULL,
    "issuedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dueDate" TIMESTAMP(3),
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'EUR',
    "status" "InvoiceStatus" NOT NULL DEFAULT 'PENDING',
    "concept" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Invoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActivityLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "changes" JSONB,
    "context" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ActivityLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sale" (
    "id" TEXT NOT NULL,
    "posId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "method" "SaleMethod" NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "inserted" DOUBLE PRECISION NOT NULL,
    "change" DOUBLE PRECISION NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "machineId" TEXT,

    CONSTRAINT "Sale_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "POS_code_key" ON "POS"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Master_serialNumber_key" ON "Master"("serialNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Master_posId_key" ON "Master"("posId");

-- CreateIndex
CREATE UNIQUE INDEX "Machine_customId_key" ON "Machine"("customId");

-- CreateIndex
CREATE UNIQUE INDEX "Machine_code_key" ON "Machine"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Machine_serialNumber_key" ON "Machine"("serialNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Machine_posId_key" ON "Machine"("posId");

-- CreateIndex
CREATE UNIQUE INDEX "Product_customId_key" ON "Product"("customId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CenterUser" ADD CONSTRAINT "CenterUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CenterUser" ADD CONSTRAINT "CenterUser_centerId_fkey" FOREIGN KEY ("centerId") REFERENCES "Center"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "POSUser" ADD CONSTRAINT "POSUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "POSUser" ADD CONSTRAINT "POSUser_posId_fkey" FOREIGN KEY ("posId") REFERENCES "POS"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Center" ADD CONSTRAINT "Center_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Center" ADD CONSTRAINT "Center_parentCenterId_fkey" FOREIGN KEY ("parentCenterId") REFERENCES "Center"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "POS" ADD CONSTRAINT "POS_centerId_fkey" FOREIGN KEY ("centerId") REFERENCES "Center"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Master" ADD CONSTRAINT "Master_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Master" ADD CONSTRAINT "Master_posId_fkey" FOREIGN KEY ("posId") REFERENCES "POS"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Machine" ADD CONSTRAINT "Machine_centerId_fkey" FOREIGN KEY ("centerId") REFERENCES "Center"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Machine" ADD CONSTRAINT "Machine_posId_fkey" FOREIGN KEY ("posId") REFERENCES "POS"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MachineProduct" ADD CONSTRAINT "MachineProduct_machineId_fkey" FOREIGN KEY ("machineId") REFERENCES "Machine"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MachineProduct" ADD CONSTRAINT "MachineProduct_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Replenishment" ADD CONSTRAINT "Replenishment_machineId_fkey" FOREIGN KEY ("machineId") REFERENCES "Machine"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Replenishment" ADD CONSTRAINT "Replenishment_routeId_fkey" FOREIGN KEY ("routeId") REFERENCES "Route"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReplenishmentItem" ADD CONSTRAINT "ReplenishmentItem_replenishmentId_fkey" FOREIGN KEY ("replenishmentId") REFERENCES "Replenishment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReplenishmentItem" ADD CONSTRAINT "ReplenishmentItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaintenanceLog" ADD CONSTRAINT "MaintenanceLog_machineId_fkey" FOREIGN KEY ("machineId") REFERENCES "Machine"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MaintenanceLog" ADD CONSTRAINT "MaintenanceLog_operatorId_fkey" FOREIGN KEY ("operatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Route" ADD CONSTRAINT "Route_operatorId_fkey" FOREIGN KEY ("operatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_centerId_fkey" FOREIGN KEY ("centerId") REFERENCES "Center"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityLog" ADD CONSTRAINT "ActivityLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sale" ADD CONSTRAINT "Sale_posId_fkey" FOREIGN KEY ("posId") REFERENCES "POS"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sale" ADD CONSTRAINT "Sale_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sale" ADD CONSTRAINT "Sale_machineId_fkey" FOREIGN KEY ("machineId") REFERENCES "Machine"("id") ON DELETE SET NULL ON UPDATE CASCADE;
