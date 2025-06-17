// app/actions/createProduct.ts
"use server";

import { db } from "@/lib/db";
import { z } from "zod";
import { ProductCategory } from "@prisma/client";

const schema = z.object({
  name: z.string().min(2),
  category: z.nativeEnum(ProductCategory),
  price: z.number().positive(),
  cost: z.number().optional(),
  unit: z.string().min(1),
  imageUrl: z.string().url().optional(),
  stockMin: z.number().int().nonnegative().optional(),
});

export async function createProduct(
  input: z.infer<typeof schema> & { tenantId: string }
) {
  const data = schema.parse(input);

  await db.product.create({
    data: {
      ...data,
      tenantId: input.tenantId,
    },
  });
}
