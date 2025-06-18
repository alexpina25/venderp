"use server";

import { db } from "@/lib/db";
import { z } from "zod";
import bcrypt from "bcryptjs";

const schema = z
  .object({
    email: z.string().email(),
    name: z.string().min(2),
    password: z.string().min(4),
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

export async function createTenantUser(
  input: z.infer<typeof schema> & { tenantId: string }
) {
  const data = schema.parse(input);

  const passwordHash = await bcrypt.hash(data.password, 10);

  const user = await db.user.create({
    data: {
      email: data.email,
      name: data.name,
      password: passwordHash,
      role: data.role,
      tenantId: input.tenantId,
    },
  });
  
  if (data.role === "CENTER_MANAGER" || data.role === "CENTER_USER") {
    await db.centerUser.create({
      data: { userId: user.id, centerId: data.centerId! },
    });
  }

  if (data.role === "POS_USER") {
    await db.pOSUser.create({
      data: { userId: user.id, posId: data.posId! },
    });
  }
}
