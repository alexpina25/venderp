// app/actions/updateCenter.ts
"use server";

import { db } from "@/lib/db";
import { z } from "zod";

const schema = z.object({
  id: z.string(),
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

export async function updateCenter(input: z.infer<typeof schema>) {
  const data = schema.parse(input);

  await db.center.update({
    where: { id: data.id },
    data: {
      name: data.name,
      address: data.address,
      city: data.city,
      postalCode: data.postalCode,
      province: data.province,
      country: data.country,
      contactName: data.contactName,
      contactPhone: data.contactPhone,
      contactEmail: data.contactEmail,
      notes: data.notes,
    },
  });
}
