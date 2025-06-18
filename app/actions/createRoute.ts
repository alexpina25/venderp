"use server";

import { db } from "@/lib/db";
import { z } from "zod";

const schema = z.object({
  date: z.string(),
  operatorId: z.string(),
  notes: z.string().optional(),
});

export async function createRoute(input: z.infer<typeof schema>) {
  const data = schema.parse(input);

  await db.route.create({
    data: {
      date: new Date(data.date),
      operatorId: data.operatorId,
      notes: data.notes ?? null,
    },
  });
}