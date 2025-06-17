// app/api/centers/route.ts
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { getServerAuthSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const session = await getServerAuthSession();
  const tenantId = session?.user?.tenant?.id;
  if (!tenantId) return NextResponse.json([], { status: 401 });

  const all = req.nextUrl.searchParams.get("all");
  const centers = await db.center.findMany({
    where: {
      tenantId,
      ...(all ? {} : { subCenters: { none: {} } }),
    },
    orderBy: { name: "asc" },
  });

  return NextResponse.json(centers);
}
