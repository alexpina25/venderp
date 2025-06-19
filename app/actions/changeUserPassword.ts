"use server";

import { db } from "@/lib/db";
import { z } from "zod";
import bcrypt from "bcryptjs";

const schema = z.object({
  id: z.string(),
  password: z.string().min(4),
});

export async function changeUserPassword(input: z.infer<typeof schema>) {
  const data = schema.parse(input);
  const hash = await bcrypt.hash(data.password, 10);
  await db.user.update({ where: { id: data.id }, data: { password: hash } });
}