import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { getServerAuthSession } from "@/lib/auth";

export async function GET() {
  const session = await getServerAuthSession();
  const tenantId = session?.user?.tenant?.id;
  if (!tenantId) return NextResponse.json([], { status: 401 });

  const masters = await db.master.findMany({
    where: { tenantId },
    include: { pos: true },
    orderBy: { serialNumber: "asc" },
  });

  return NextResponse.json(masters);
}
