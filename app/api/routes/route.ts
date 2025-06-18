import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { getServerAuthSession } from "@/lib/auth";

export async function GET() {
  const session = await getServerAuthSession();
  const tenantId = session?.user?.tenant?.id;
  if (!tenantId) return NextResponse.json([], { status: 401 });

  const routes = await db.route.findMany({
    where: { operator: { tenantId } },
    include: {
      operator: true,
      replenishments: { include: { machine: true } },
    },
    orderBy: { date: "desc" },
  });

  return NextResponse.json(routes);
}

export async function POST(req: NextRequest) {
  const session = await getServerAuthSession();
  const tenantId = session?.user?.tenant?.id;
  if (!tenantId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { date, operatorId, notes } = await req.json();

  const route = await db.route.create({
    data: {
      date: new Date(date),
      operatorId,
      notes: notes ?? null,
    },
  });

  return NextResponse.json(route, { status: 201 });
}