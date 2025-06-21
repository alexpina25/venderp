"use server";

import { db } from "@/lib/db";
import { z } from "zod";

const schema = z.object({
  id: z.string(),
  date: z.string(),
  operatorId: z.string(),
  notes: z.string().optional(),
});

export async function updateRoute(input: z.infer<typeof schema>) {
  const data = schema.parse(input);

  await db.route.update({
    where: { id: data.id },
    data: {
      date: new Date(data.date),
      operatorId: data.operatorId,
      notes: data.notes ?? null,
    },
  });
}
