import { db } from "@/lib/db";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const pos = await db.pOS.findUnique({
      where: { id: params.id },
      include: {
        center: true,
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

    if (!pos) {
      return new Response("POS not found", { status: 404 });
    }

    return new Response(JSON.stringify(pos), {
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
