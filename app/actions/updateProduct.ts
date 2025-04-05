// app/actions/updateProduct.ts
"use server";

import { db } from "@/lib/db";
import { z } from "zod";
import { ProductCategory } from "@prisma/client";

const schema = z.object({
  id: z.string(),
  name: z.string().min(2),
  category: z.nativeEnum(ProductCategory),
  price: z.number().positive(),
  cost: z.number().optional(),
  unit: z.string().min(1),
  imageUrl: z.string().url().optional(),
  stockMin: z.number().int().nonnegative().optional(),
});

export async function updateProduct(input: z.infer<typeof schema>) {
  const data = schema.parse(input);

  await db.product.update({
    where: { id: data.id },
    data: {
      name: data.name,
      category: data.category,
      price: data.price,
      cost: data.cost ?? null,
      unit: data.unit,
      imageUrl: data.imageUrl ?? null,
      stockMin: data.stockMin ?? null,
    },
  });
}
