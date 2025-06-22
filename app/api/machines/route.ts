import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { getServerAuthSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const session = await getServerAuthSession();
  const tenantId = session?.user?.tenant?.id;
  if (!tenantId) return NextResponse.json([], { status: 401 });

  const machines = await db.machine.findMany({
    where: { center: { tenantId } },
    include: { pos: true, center: true },
    orderBy: { code: "asc" },
  });

  return NextResponse.json(machines);
}
