// app/api/centers/route.ts
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const centers = await db.center.findMany({
    orderBy: { name: "asc" },
  });

  return NextResponse.json(centers);
}
