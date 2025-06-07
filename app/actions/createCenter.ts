// app/actions/createCenter.ts
"use server";

import { db } from "@/lib/db";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(2),
  address: z.string().min(5),
  city: z.string().min(2),
  postalCode: z.string().optional(),
  province: z.string().optional(),
  country: z.string().optional(),
  contactName: z.string(),
  contactPhone: z.string(),
  contactEmail: z.string().email().optional(),
  notes: z.string().optional(),
});

export async function createCenter(input: z.infer<typeof schema>) {
  const data = schema.parse(input);

  await db.center.create({
    data: {
      ...data,
    },
  });
}
