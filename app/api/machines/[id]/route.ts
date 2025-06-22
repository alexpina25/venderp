import { db } from "@/lib/db";
import { getServerAuthSession } from "@/lib/auth";
import { ok, error, handleError } from "@/lib/apiResponses";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerAuthSession();
    const tenantId = session?.user?.tenant?.id;

    const machine = await db.machine.findFirst({
      where: { id: params.id, tenantId },
      include: {
        pos: true,
        products: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!machine) {
      return error("Machine not found", 404);
    }

    return ok(machine);
  } catch (error) {
    return handleError(error, "Error fetching machine data");
  }
}
