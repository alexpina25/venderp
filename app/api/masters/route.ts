import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const apiKey = req.headers.get("x-api-key");
  if (apiKey !== process.env.DEVICE_API_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

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
