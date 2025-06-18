"use server";

import { db } from "@/lib/db";
import { z } from "zod";
import bcrypt from "bcryptjs";

const schema = z
  .object({
    id: z.string(),
    email: z.string().email(),
    name: z.string().min(2),
    password: z.string().min(4).optional(),
    role: z.enum([
      "TENANT_ADMIN",
      "TENANT_USER",
      "CENTER_MANAGER",
      "CENTER_USER",
      "POS_USER",
    ]),
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

  const passwordHash = data.password
    ? await bcrypt.hash(data.password, 10)
    : undefined;

  await db.$transaction(async (tx) => {
    await tx.centerUser.deleteMany({ where: { userId: data.id } });
    await tx.pOSUser.deleteMany({ where: { userId: data.id } });

    await tx.user.update({
      where: { id: data.id },
      data: {
        email: data.email,
        name: data.name,
        role: data.role,
        ...(passwordHash ? { password: passwordHash } : {}),
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
