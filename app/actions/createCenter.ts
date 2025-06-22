// app/actions/createCenter.ts
"use server";

import { db } from "@/lib/db";
import { generateCustomId } from "@/lib/customId";
import { z } from "zod";
import { Prisma } from "@prisma/client";

const schema = z
  .object({
    name: z.string().min(2),
    address: z.string().min(5),
    city: z.string().min(2),
    postalCode: z.string().optional(),
    province: z.string().optional(),
    country: z.string().optional(),
    contactName: z.string().optional(),
    contactPhone: z.string().optional(),
    contactEmail: z.string().email().optional(),
    isParent: z.boolean().optional(),
    parentCenterId: z.string().optional(),
    notes: z.string().optional(),
  })
  .refine((data) => data.isParent || !!data.parentCenterId, {
    message: "Centro padre requerido",
    path: ["parentCenterId"],
  });

export async function createCenter(
  input: z.infer<typeof schema> & { tenantId: string }
) {
  const data = schema.parse(input);

  const centerData: Prisma.CenterUncheckedCreateInput = {
    name: data.name,
    address: data.address,
    city: data.city,
    postalCode: data.postalCode ?? null,
    province: data.province ?? null,
    country: data.country ?? null,
    contactName: data.contactName ?? null,
    contactPhone: data.contactPhone ?? null,
    contactEmail: data.contactEmail ?? null,
    isParent: data.isParent ?? false,
    parentCenterId: data.isParent ? null : data.parentCenterId ?? null,
    notes: data.notes ?? null,
    tenantId: input.tenantId,
    customId: await generateCustomId("Center", input.tenantId),
  };

  await db.center.create({
    data: centerData,
  });
}
