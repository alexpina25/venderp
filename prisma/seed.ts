import {
  PrismaClient,
  ProductCategory,
  MachineStatus,
  SaleMethod,
} from "@prisma/client";
import { faker } from "@faker-js/faker";
import bcrypt from "bcryptjs";
const prisma = new PrismaClient();

async function main() {
  const plainPassword = "asdasdasd";
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

    const posIds: string[] = [];

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
          active: faker.datatype.boolean(),
        },
      });

      for (let s = 0; s < 2; s++) {
        const subCenter = await prisma.center.create({
          data: {
            name: `Centro ${s + 1}`,
            address: faker.location.streetAddress(),
            city: faker.location.city(),
            contactName: faker.person.fullName(),
            contactPhone: faker.phone.number(),
            tenantId: tenant.id,
            parentCenterId: parentCenter.id,
            country: "España",
            active: faker.datatype.boolean(),
          },
        });

        for (let p = 0; p < 2; p++) {
          const pos = await prisma.pOS.create({
            data: {
              code: `T${t + 1}C${c + 1}S${s + 1}P${p + 1}`,
              name: `Punto de venta ${p + 1}`,
              address: faker.location.streetAddress(),
              city: faker.location.city(),
              centerId: subCenter.id,
              coverage: faker.number.int({ min: 0, max: 31 }),
              active: faker.datatype.boolean(),
            },
          });
          posIds.push(pos.id);

          await prisma.master.create({
            data: {
              serialNumber: faker.string.alphanumeric(12),
              tenantId: tenant.id,
              posId: pos.id,
            },
          });

          const machine = await prisma.machine.create({
            data: {
              code: faker.string.uuid(),
              model: "Basic Vender",
              serialNumber: faker.string.alphanumeric(10),
              type: "SNACK",
              centerId: subCenter.id,
              posId: pos.id,
              status: faker.helpers.arrayElement(Object.values(MachineStatus)),
              installedAt: faker.date.past(),
            },
          });

          const product = await prisma.product.create({
            data: {
              tenantId: tenant.id,
              name: faker.commerce.productName(),
              price: parseFloat(
                faker.number
                  .float({ min: 1, max: 3, fractionDigits: 2 })
                  .toFixed(2)
              ),
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

          for (let v = 0; v < 5; v++) {
            const method = faker.helpers.arrayElement(
              Object.values(SaleMethod)
            );
            const price = product.price;
            const inserted =
              method === SaleMethod.CARD
                ? price
                : parseFloat(
                    (
                      price +
                      faker.number.float({ min: 0, max: 2, fractionDigits: 2 })
                    ).toFixed(2)
                  );
            const change = parseFloat((inserted - price).toFixed(2));
            await prisma.sale.create({
              data: {
                posId: pos.id,
                productId: product.id,
                machineId: machine.id,
                method,
                price,
                inserted,
                change,
                timestamp: faker.date.recent(),
              },
            });
          }
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
