import { db } from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const center = await db.center.findUnique({
      where: { id: params.id },
      include: {
        pos: {
          include: {
            Sale: { orderBy: { timestamp: "desc" }, take: 1 },
            machine: true,
            master: true,
          },
        },
        subCenters: {
          include: {
            parentCenter: { select: { name: true } },
            pos: { where: { active: true }, select: { id: true } },
          },
        },
      },
    });

    if (!center) {
      return new Response("Center not found", { status: 404 });
    }

    const transformed = {
      ...center,
      pos: center.pos.map((p) => ({ ...p, lastSale: p.Sale[0] || null })),
    };

    return new Response(JSON.stringify(transformed), {
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
