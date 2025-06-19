"use server";

import { db } from "@/lib/db";
import { z } from "zod";

const stopSchema = z.object({
  posId: z.string(),
  cashCollected: z.coerce.number().optional(),
  walletReload: z.coerce.number().optional(),
  maintenanceNotes: z.string().optional(),
  priceChangeNotes: z.string().optional(),
  notes: z.string().optional(),
});


const schema = z.object({
  date: z.string(),
  operatorId: z.string(),
  notes: z.string().optional(),
    stops: z.array(stopSchema),
});

export async function createRoute(input: z.infer<typeof schema>) {
  const data = schema.parse(input);

  await db.route.create({
    data: {
      date: new Date(data.date),
      operatorId: data.operatorId,
      notes: data.notes ?? null,
            stops: {
        create: data.stops.map((s) => ({
          posId: s.posId,
          cashCollected: s.cashCollected ?? null,
          walletReload: s.walletReload ?? null,
          maintenanceNotes: s.maintenanceNotes ?? null,
          priceChangeNotes: s.priceChangeNotes ?? null,
          notes: s.notes ?? null,
        })),
      },
    },
  });
}