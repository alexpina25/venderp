import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const masters = await db.master.findMany({
      include: { pos: true, tenant: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(masters);
  } catch (error) {
    console.error("Error fetching masters:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
