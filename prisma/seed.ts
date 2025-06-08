import { PrismaClient, ProductCategory } from "@prisma/client";
import { faker } from "@faker-js/faker";
import bcrypt from 'bcryptjs';
const prisma = new PrismaClient();


async function main() {
    const plainPassword = 'asdasdasd';
const passwordHash = await bcrypt.hash(plainPassword, 10);

  for (let t = 0; t < 3; t++) {
    const tenant = await prisma.tenant.create({
      data: {
        name: `Tenant ${faker.company.name()}`,
        users: {
          create: [
            {
              name: faker.person.fullName(),
              email: faker.internet.email(),
              password: passwordHash,
              role: "TENANT_ADMIN",
            },
            
            {
              name: faker.person.fullName(),
              email: faker.internet.email(),
              password: passwordHash,
              role: "TENANT_USER",
            },
            {
              name: faker.person.fullName(),
              email: faker.internet.email(),
              password: passwordHash,
              role: "TENANT_USER",
            },
          ],
        },
      },
      include: { users: true },
    });

    for (let c = 0; c < 2; c++) {
      const parentCenter = await prisma.center.create({
        data: {
          name: `Centro Padre ${c + 1} - ${tenant.name}`,
          address: faker.location.streetAddress(),
          city: faker.location.city(),
          contactName: faker.person.fullName(),
          contactPhone: faker.phone.number(),
          tenantId: tenant.id,
          country: "España",
        },
      });

      for (let s = 0; s < 2; s++) {
        const subCenter = await prisma.center.create({
          data: {
            name: `SubCentro ${s + 1}`,
            address: faker.location.streetAddress(),
            city: faker.location.city(),
            contactName: faker.person.fullName(),
            contactPhone: faker.phone.number(),
            tenantId: tenant.id,
            parentCenterId: parentCenter.id,
            country: "España",
          },
        });

        for (let p = 0; p < 2; p++) {
          const pof = await prisma.pOF.create({
            data: {
              name: `POF ${p + 1}`,
              address: faker.location.streetAddress(),
              city: faker.location.city(),
              centerId: subCenter.id,
            },
          });

          const machine = await prisma.machine.create({
            data: {
              code: faker.string.uuid(),
              model: "Basic Vender",
              serialNumber: faker.string.alphanumeric(10),
              type: "SNACK",
              centerId: subCenter.id,
              pofId: pof.id,
              status: "ACTIVE",
              installedAt: faker.date.past(),
            },
          });

          const product = await prisma.product.create({
            data: {
              name: faker.commerce.productName(),
              price: parseFloat(faker.commerce.price()),
              category: ProductCategory.SNACK,
              unit: "unit",
            },
          });

          await prisma.machineProduct.create({
            data: {
              machineId: machine.id,
              productId: product.id,
              currentStock: 10,
              maxCapacity: 20,
              minThreshold: 5,
              price: 1.5,
              line: "A1",
              selection: "101",
            },
          });
        }
      }
    }
  }

  console.log("🌱 Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
