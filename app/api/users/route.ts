import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { getServerAuthSession } from "@/lib/auth";
import { Role } from "@prisma/client";

export async function GET(req: NextRequest) {
  const session = await getServerAuthSession();
  const tenantId = session?.user?.tenant?.id;
  if (!tenantId) return NextResponse.json([], { status: 401 });

  const role = req.nextUrl.searchParams.get("role");
  const users = await db.user.findMany({
    where: {
      tenantId,
      ...(role ? { role: role as Role } : {}),
    },
    orderBy: { name: "asc" },
  });

  return NextResponse.json(users);
}
