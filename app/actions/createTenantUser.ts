"use server";

import { db } from "@/lib/db";
import { z } from "zod";
import bcrypt from "bcryptjs";

const schema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
  password: z.string().min(4),
  role: z.enum(["TENANT_ADMIN", "TENANT_USER"]),
});

export async function createTenantUser(
  input: z.infer<typeof schema> & { tenantId: string }
) {
  const data = schema.parse(input);

  const passwordHash = await bcrypt.hash(data.password, 10);

  await db.user.create({
    data: {
      email: data.email,
      name: data.name,
      password: passwordHash,
      role: data.role,
      tenantId: input.tenantId,
    },
  });
}
