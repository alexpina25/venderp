import { db } from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const machine = await db.machine.findUnique({
      where: { id: params.id },
      include: {
        location: true,
        products: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!machine) {
      return new Response("Machine not found", { status: 404 });
    }

    return new Response(JSON.stringify(machine), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return new Response("Error fetching machine data", { status: 500 });
  }
}
