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

    const stop = await db.routeStop.findFirst({
      where: { id: params.id, route: { operator: { tenantId } } },
      include: { pos: true },
    });

    if (!stop) {
      return error("Stop not found", 404);
    }

    return ok(stop);
  } catch (err) {
    return handleError(err, "Error fetching stop");
  }
}
