"use server";

import { db } from "@/lib/db";
import { generateCustomId } from "@/lib/customId";
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
  const operator = await db.user.findUnique({
    where: { id: data.operatorId },
    select: { tenantId: true },
  });
  if (!operator || !operator.tenantId) throw new Error("Operator not found");

  await db.route.create({
    data: {
      date: new Date(data.date),
      operatorId: data.operatorId,
      customId: await generateCustomId("Route", operator.tenantId),
      stops: {
        create: data.stops.map((s) => ({
          posId: s.posId,
        })),
      },
    },
  });
}
