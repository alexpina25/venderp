"use server";

import { db } from "@/lib/db";
import { z } from "zod";

const schema = z.object({
  machineId: z.string(),
  productId: z.string(),
  quantity: z.number().int().positive(),
  price: z.number(),
  line: z.string(),
  selection: z.string(),
});

export async function addMachineProduct(input: z.infer<typeof schema>) {
  const data = schema.parse(input);

  await db.machine.update({
    where: { id: data.machineId },
    data: {
      products: {
        create: {
          productId: data.productId,
          currentStock: data.quantity,
          maxCapacity: data.quantity,
          minThreshold: 1,
          line: data.line,
          selection: data.selection,
          price: data.price,
        },
      },
    },
  });
}
