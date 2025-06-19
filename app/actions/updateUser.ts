"use server";

import { db } from "@/lib/db";
import { z } from "zod";

const schema = z
  .object({
    id: z.string(),
    name: z.string().min(2),
    role: z.enum([
      "TENANT_ADMIN",
      "TENANT_USER",
      "CENTER_MANAGER",
      "CENTER_USER",
      "POS_USER",
    ]),
        active: z.boolean(),
    centerId: z.string().optional(),
    posId: z.string().optional(),
  })
  .refine(
    (data) =>
      !["CENTER_MANAGER", "CENTER_USER"].includes(data.role) || !!data.centerId,
    {
      message: "centerId is required",
      path: ["centerId"],
    }
  )
  .refine((data) => data.role !== "POS_USER" || !!data.posId, {
    message: "posId is required",
    path: ["posId"],
  });

export async function updateUser(input: z.infer<typeof schema>) {
  const data = schema.parse(input);

  await db.$transaction(async (tx) => {
    await tx.centerUser.deleteMany({ where: { userId: data.id } });
    await tx.pOSUser.deleteMany({ where: { userId: data.id } });

    await tx.user.update({
      where: { id: data.id },
      data: {
        name: data.name,
        role: data.role,
      },
    });

    if (data.role === "CENTER_MANAGER" || data.role === "CENTER_USER") {
      if (data.centerId) {
        await tx.centerUser.create({
          data: { userId: data.id, centerId: data.centerId },
        });
      }
    }

    if (data.role === "POS_USER") {
      if (data.posId) {
        await tx.pOSUser.create({
          data: { userId: data.id, posId: data.posId },
        });
      }
    }
  });
}
