"use server";

import { db } from "@/lib/db";
import { z } from "zod";

const schema = z.object({
  id: z.string(),
  cashCollected: z.string().optional(),
  walletReload: z.string().optional(),
  maintenanceNotes: z.string().optional(),
  priceChangeNotes: z.string().optional(),
  notes: z.string().optional(),
});

export async function updateRouteStop(input: z.infer<typeof schema>) {
  const data = schema.parse(input);

  await db.routeStop.update({
    where: { id: data.id },
    data: {
      cashCollected: data.cashCollected ? parseFloat(data.cashCollected) : null,
      walletReload: data.walletReload ? parseFloat(data.walletReload) : null,
      maintenanceNotes: data.maintenanceNotes ?? null,
      priceChangeNotes: data.priceChangeNotes ?? null,
      notes: data.notes ?? null,
    },
  });
}
