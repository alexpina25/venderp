import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { getServerAuthSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const session = await getServerAuthSession();
  const tenantId = session?.user?.tenant?.id;
  if (!tenantId) return NextResponse.json([], { status: 401 });

  const role = req.nextUrl.searchParams.get("role");

  const users = await db.user.findMany({
    where: {
      tenantId,
      ...(role ? { role } : {}),
    },
    orderBy: { name: "asc" },
  });

  return NextResponse.json(users);
}