import { db } from "@/lib/db";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { RouteCards } from "@/components/routes/RouteCards";
import { Separator } from "@/components/ui/separator";

export default async function RoutesPage() {
  const routes = await db.route.findMany({
    include: {
      operator: true,
      replenishments: { include: { machine: true } },
      stops: { include: { pos: true } },
    },
    orderBy: { date: "desc" },
  });

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Gestión de Rutas
          </h1>
          <p className="text-muted-foreground text-sm">
            Listado de rutas programadas por fecha.
          </p>
        </div>
        <Button asChild>
          <Link href="/routes/new">+ Nueva ruta</Link>
        </Button>
      </div>

      <Separator />

      {routes.length === 0 ? (
        <div className="text-muted-foreground text-center py-12">
          No hay rutas programadas aún.
        </div>
      ) : (
        <RouteCards data={routes} />
      )}
    </div>
  );
}
