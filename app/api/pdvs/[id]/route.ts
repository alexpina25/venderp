import { db } from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const pdv = await db.pOS.findUnique({
      where: { id: params.id },
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
      },
    });

    if (!pdv) {
      return new Response("PDV not found", { status: 404 });
    }

    return new Response(JSON.stringify(pdv), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error fetching PDV:", error);
    return new Response("Error fetching PDV", { status: 500 });
  }
}
