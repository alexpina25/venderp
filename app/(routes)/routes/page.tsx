// app/(routes)/routes/page.tsx
import { db } from "@/lib/db";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import Link from "next/link";
import { Button } from "@/components/ui/button";

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
          <ul className="space-y-4">
            {routes.map((route) => (
              <li
                key={route.id}
                className="border rounded-md p-4 hover:bg-muted transition"
              >
                <Link href={`/routes/${route.id}`} className="block">
                  <div className="flex justify-between items-center mb-1">
                    <p className="font-semibold">
                      {format(new Date(route.date), "PPP", { locale: es })}
                    </p>
                  <span className="text-xs text-muted-foreground">
                    {route.replenishments.length} máquina
                    {route.replenishments.length !== 1 && "s"}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Operador: {route.operator?.name ?? "Sin asignar"}
                </p>
                                {route.stops.length > 0 && (
                  <ul className="mt-2 text-sm list-disc ml-4">
                    {route.stops.map((stop) => (
                      <li key={stop.id}>
                        {stop.pos.name}: {stop.cashCollected ?? 0}€ cobrados,
                        recarga {stop.walletReload ?? 0}€
                      </li>
                    ))}
                  </ul>
                )}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
