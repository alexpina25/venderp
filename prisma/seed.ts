import {
  PrismaClient,
  ProductCategory,
  MachineStatus,
  SaleMethod,
} from "@prisma/client";
import { fakerES as faker } from "@faker-js/faker";
import bcrypt from "bcryptjs";
import { generateCustomId } from "../lib/customId";

const prisma = new PrismaClient();

async function main() {
  const plainPassword = "asdasdasd";
  const passwordHash = await bcrypt.hash(plainPassword, 10);

  for (let t = 0; t < 3; t++) {
    const tenant = await prisma.tenant.create({
      data: {
        name: `Tenant ${faker.company.name()}`,
        customId: t + 1,
      },
    });

    const users = [] as { id: string }[];

    const admin = await prisma.user.create({
      data: {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: passwordHash,
        role: "TENANT_ADMIN",
        tenantId: tenant.id,
        customId: await generateCustomId("User", tenant.id),
      },
    });
    users.push(admin);

    for (let u = 0; u < 2; u++) {
      const user = await prisma.user.create({
        data: {
          name: faker.person.fullName(),
          email: faker.internet.email(),
          password: passwordHash,
          role: "TENANT_USER",
          tenantId: tenant.id,
          customId: await generateCustomId("User", tenant.id),
        },
      });
      users.push(user);
    }

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
          customId: await generateCustomId("Center", tenant.id),
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
            customId: await generateCustomId("Center", tenant.id),
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
              customId: await generateCustomId("POS", tenant.id),
            },
          });
          posIds.push(pos.id);

          await prisma.master.create({
            data: {
              serialNumber: faker.string.alphanumeric(12),
              tenantId: tenant.id,
              posId: pos.id,
              customId: await generateCustomId("Master", tenant.id),
            },
          });

          const machine = await prisma.machine.create({
            data: {
              brand: faker.company.name(),
              model: "Basic Vender",
              serialNumber: faker.string.alphanumeric(10),
              type: "SNACK",
              tenantId: tenant.id,
              centerId: subCenter.id,
              posId: pos.id,
              status: faker.helpers.arrayElement(Object.values(MachineStatus)),
              installedAt: faker.date.past(),
              customId: await generateCustomId("Machine", tenant.id),
            },
          });

          const products = [];
          for (let pr = 0; pr < 3; pr++) {
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
                unit: "unidad",
                customId: await generateCustomId("Product", tenant.id),
              },
            });
            products.push(product);
          }

          for (let i = 0; i < products.length; i++) {
            const product = products[i];
            await prisma.machineProduct.create({
              data: {
                machineId: machine.id,
                productId: product.id,
                currentStock: 10,
                maxCapacity: 20,
                minThreshold: 5,
                price: product.price,
                line: `A${i + 1}`,
                selection: `10${i + 1}`,
                customId: await generateCustomId("MachineProduct", tenant.id),
              },
            });

            const startDate = faker.date.past({ years: 1 });
            for (let v = 0; v < 20; v++) {
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
                        faker.number.float({
                          min: 0,
                          max: 2,
                          fractionDigits: 2,
                        })
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
                  timestamp: faker.date.between({
                    from: startDate,
                    to: new Date(),
                  }),
                  customId: await generateCustomId("Sale", tenant.id),
                },
              });
            }
          }
        }
      }
    }

    // Crear rutas para este tenant
    for (let r = 0; r < 2; r++) {
      const route = await prisma.route.create({
        data: {
          date: faker.date.recent({ days: 30 }),
          operatorId: users[0].id,
          notes: `Ruta ${r + 1}`,
          customId: await generateCustomId("Route", tenant.id),
        },
      });

      for (const posId of posIds) {
        await prisma.routeStop.create({
          data: {
            routeId: route.id,
            posId,
            notes: "Parada de ruta",
            customId: await generateCustomId("RouteStop", tenant.id),
          },
        });
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
