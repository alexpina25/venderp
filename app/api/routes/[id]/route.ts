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

    const route = await db.route.findFirst({
      where: { id: params.id, operator: { tenantId } },
      include: {
        operator: true,
        stops: { include: { pos: true } },
        replenishments: { include: { machine: true } },
      },
    });

    if (!route) {
      return error("Route not found", 404);
    }

    return ok(route);
  } catch (err) {
    return handleError(err, "Error fetching route");
  }
}