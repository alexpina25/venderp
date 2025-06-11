import { db } from "@/lib/db";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const pof = await db.pOF.findUnique({
      where: { id: params.id },
      include: {
        center: true,
        machine: {
          include: {
            pof: true,
            products: {
              include: { product: true },
            },
          },
        },
      },
    });

    if (!pof) {
      return new Response("POF not found", { status: 404 });
    }

    return new Response(JSON.stringify(pof), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error fetching POF:", error);
    return new Response("Error fetching POF", { status: 500 });
  }
}
