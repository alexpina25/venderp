-- AlterEnum
ALTER TYPE "MachineStatus" ADD VALUE IF NOT EXISTS 'NOT_INSTALLED';

-- DropIndex
DROP INDEX IF EXISTS "Machine_code_key";

-- AlterTable
ALTER TABLE "Machine"
  DROP COLUMN IF EXISTS "code",
  ALTER COLUMN "centerId" DROP NOT NULL;
