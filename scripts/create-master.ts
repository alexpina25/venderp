import inquirer from "inquirer";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const tenants = await prisma.tenant.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true, customId: true },
  });

  if (tenants.length === 0) {
    console.log("❌ No hay tenants existentes. Crea uno antes de continuar.");
    return;
  }

  const { tenantId } = await inquirer.prompt([
    {
      name: "tenantId",
      message: "Selecciona un tenant (customId - nombre):",
      type: "list",
      choices: tenants.map((t) => ({
        name: `${t.customId ?? "-"} - ${t.name}`,
        value: t.id,
      })),
    },
  ]);

  const { serialNumber } = await inquirer.prompt([
    {
      name: "serialNumber",
      message: "Número de serie del master:",
      type: "input",
    },
  ]);

  const existingMaster = await prisma.master.findUnique({
    where: { serialNumber },
    select: { tenantId: true },
  });

  if (existingMaster) {
    if (existingMaster.tenantId !== tenantId) {
      console.log("❌ El master ya está registrado en otro tenant.");
    } else {
      console.log(
        "❌ Ya existe un master con ese número de serie en este tenant."
      );
    }
    return;
  }

  const master = await prisma.master.create({
    data: {
      serialNumber,
      tenantId,
    },
  });

  console.log("\n✅ Master creado correctamente:\n", {
    id: master.id,
    serialNumber: master.serialNumber,
    tenantId: master.tenantId,
  });

  await prisma.$disconnect();
}

main().catch((error) => {
  console.error("❌ Error:", error);
  prisma.$disconnect();
  process.exit(1);
});
