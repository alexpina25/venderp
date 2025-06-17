import { db } from "@/lib/db";
import { getServerAuthSession } from "@/lib/auth";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerAuthSession();
    const tenantId = session?.user?.tenant?.id;

    const machine = await db.machine.findFirst({
      where: { id: params.id, center: { tenantId } },
      include: {
        pos: true,
        center: true,
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
