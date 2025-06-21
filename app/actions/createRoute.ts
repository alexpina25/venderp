"use server";

import { db } from "@/lib/db";
import { z } from "zod";

const stopSchema = z.object({
  posId: z.string(),
});

const schema = z.object({
  date: z.string(),
  operatorId: z.string(),
  stops: z.array(stopSchema),
});

export async function createRoute(input: z.infer<typeof schema>) {
  const data = schema.parse(input);

  await db.route.create({
    data: {
      date: new Date(data.date),
      operatorId: data.operatorId,
      stops: {
        create: data.stops.map((s) => ({
          posId: s.posId,
        })),
      },
    },
  });
}
