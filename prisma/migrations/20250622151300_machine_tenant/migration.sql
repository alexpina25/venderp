-- AlterTable
ALTER TABLE "Machine" ADD COLUMN "tenantId" TEXT;

UPDATE "Machine" SET "tenantId" = c."tenantId"
FROM "Center" c
WHERE "Machine"."centerId" = c.id;

ALTER TABLE "Machine" ALTER COLUMN "tenantId" SET NOT NULL;

ALTER TABLE "Machine" DROP CONSTRAINT IF EXISTS "Machine_centerId_fkey";
ALTER TABLE "Machine" DROP COLUMN "centerId";

-- AddForeignKey
ALTER TABLE "Machine" ADD CONSTRAINT "Machine_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
