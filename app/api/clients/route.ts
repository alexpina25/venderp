// app/api/clients/route.ts
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const clients = await db.client.findMany({
    orderBy: { name: "asc" },
  });

  return NextResponse.json(clients);
}
