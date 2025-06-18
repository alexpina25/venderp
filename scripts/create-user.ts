// scripts/create-user.ts
import bcrypt from "bcryptjs";
import inquirer from "inquirer";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const { email, name, password, tenantChoice } = await inquirer.prompt([
    {
      name: "email",
      message: "Email del usuario:",
      type: "input",
    },
    {
      name: "name",
      message: "Nombre del usuario:",
      type: "input",
    },
    {
      name: "password",
      message: "Contraseña:",
      type: "password",
    },
    {
      name: "tenantChoice",
      message: "¿Crear nuevo tenant o usar existente?",
      type: "list",
      choices: ["Crear nuevo", "Usar existente"],
    },
  ]);

  let tenantId: string;

  if (tenantChoice === "Crear nuevo") {
    const { tenantName } = await inquirer.prompt([
      {
        name: "tenantName",
        message: "Nombre del nuevo tenant:",
        type: "input",
      },
    ]);

    const tenant = await prisma.tenant.create({
      data: {
        name: tenantName,
      },
    });

    tenantId = tenant.id;
  } else {
    const tenants = await prisma.tenant.findMany();
    if (tenants.length === 0) {
      console.log("❌ No hay tenants existentes. Ejecuta de nuevo y crea uno.");
      return;
    }

    const { selectedTenant } = await inquirer.prompt([
      {
        name: "selectedTenant",
        message: "Selecciona un tenant:",
        type: "list",
        choices: tenants.map((t) => ({ name: t.name, value: t.id })),
      },
    ]);

    tenantId = selectedTenant;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      name,
      password: hashedPassword,
      role: "TENANT_ADMIN",
      tenantId,
    },
  });

  console.log("\n✅ Usuario creado correctamente:\n", {
    id: user.id,
    email: user.email,
    name: user.name,
    tenantId: user.tenantId,
  });

  await prisma.$disconnect();
}

main().catch((error) => {
  console.error("❌ Error:", error);
  prisma.$disconnect();
  process.exit(1);
});
