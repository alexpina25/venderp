import { db } from "./db";

export async function generateCustomId(model: string, tenantId: string) {
  const counter = await db.counter.upsert({
    where: { tenantId_model: { tenantId, model } },
    update: { lastValue: { increment: 1 } },
    create: { tenantId, model, lastValue: 1 },
  });

  return counter.lastValue;
}

