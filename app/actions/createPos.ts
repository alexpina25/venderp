"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { randomUUID } from "crypto";

interface CreatePosInput {
  code: string;
  name: string;
  address: string;
  city: string;
  postalCode?: string;
  province?: string;
  country?: string;
  contactName?: string;
  contactPhone?: string;
  contactEmail?: string;
  notes?: string;
  centerId: string;
}

export async function createPos(data: CreatePosInput) {
  await db.pOS.create({
    data: {
      code: data.code,
      name: data.name,
      address: data.address,
      city: data.city,
      postalCode: data.postalCode,
      province: data.province,
      country: data.country || "España",
      contactName: data.contactName,
      contactPhone: data.contactPhone,
      contactEmail: data.contactEmail,
      notes: data.notes,
      centerId: data.centerId,
      coverage: 0,
    },
  });

  revalidatePath("/pos");
}
