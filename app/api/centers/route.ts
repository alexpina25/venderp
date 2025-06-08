// app/api/centers/route.ts
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const all = req.nextUrl.searchParams.get("all");
  const centers = await db.center.findMany({
    where: all ? undefined : { subCenters: { none: {} } },
    orderBy: { name: "asc" },
  });

  return NextResponse.json(centers);
}
