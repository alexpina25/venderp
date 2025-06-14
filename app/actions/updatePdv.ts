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
  contactName: z.string().optional(),
  contactPhone: z.string().optional(),
  contactEmail: z.string().email().optional(),
  notes: z.string().optional(),
});

export async function updatePdv(input: z.infer<typeof schema>) {
  const values = schema.parse(input);

  await db.pos.update({
    where: { id: values.id },
    data: {
      name: values.name,
      address: values.address,
      city: values.city,
      postalCode: values.postalCode,
      province: values.province,
      country: values.country,
      contactName: values.contactName,
      contactPhone: values.contactPhone,
      contactEmail: values.contactEmail,
      notes: values.notes,
    },
  });
}
