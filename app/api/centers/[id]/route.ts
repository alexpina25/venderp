import { db } from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const center = await db.center.findUnique({
      where: { id: params.id },
      include: { pos: true },
    });

    if (!center) {
      return new Response("Center not found", { status: 404 });
    }

    return new Response(JSON.stringify(center), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error fetching center:", error);
    return new Response("Error fetching center", { status: 500 });
  }
}
