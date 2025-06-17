import { db } from "@/lib/db";
import { getServerAuthSession } from "@/lib/auth";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerAuthSession();
    const tenantId = session?.user?.tenant?.id;

    const pos = await db.pOS.findFirst({
      where: { id: params.id, center: { tenantId } },
      include: {
        center: true,
        master: true,
        machine: {
          include: {
            pos: true,
            products: {
              include: { product: true },
            },
          },
        },
        Sale: { orderBy: { timestamp: "desc" }, take: 1 },
      },
    });

    if (!pos) {
      return new Response("POS not found", { status: 404 });
    }

    const result = {
      ...pos,
      lastSale: pos?.Sale?.[0] || null,
    };

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error fetching POS:", error);
    return new Response("Error fetching POS", { status: 500 });
  }
}
