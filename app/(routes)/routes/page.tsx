// app/(routes)/routes/page.tsx
import { db } from "@/lib/db";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { RouteTable } from "@/components/routes/RouteTable";

export default async function RoutesPage() {
  const routes = await db.route.findMany({
    include: {
      operator: true,
      replenishments: {
        include: { machine: true },
      },
            stops: { include: { pos: true } },
    },
    orderBy: { date: "desc" },
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Rutas de Reposición</h2>
        <Button asChild>
          <Link href="/routes/new">+ Nueva ruta</Link>
        </Button>
      </div>

      <div className="border rounded-lg p-4 bg-background shadow">
        {routes.length === 0 ? (
          <p className="text-muted-foreground">No hay rutas programadas aún.</p>
        ) : (
          <RouteTable data={routes} />
        )}
      </div>
    </div>
  );
}
