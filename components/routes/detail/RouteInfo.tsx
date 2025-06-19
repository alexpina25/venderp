import { RouteWithStops } from "@/types";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface Props {
  route: RouteWithStops;
}

export function RouteInfo({ route }: Props) {
  const completedStops = route.stops.filter(
    (s) =>
      s.cashCollected !== null ||
      s.walletReload !== null ||
      s.notes !== null ||
      s.maintenanceNotes !== null ||
      s.priceChangeNotes !== null
  ).length;

  return (
    <div className="grid md:grid-cols-2 gap-6 bg-background rounded-lg p-4 border">
      <div>
        <p className="text-sm text-muted-foreground">Fecha</p>
        <p className="font-medium">
          {format(new Date(route.date), "PPP", { locale: es })}
        </p>
      </div>
      <div>
        <p className="text-sm text-muted-foreground">Operario</p>
        <p>{route.operator?.name ?? "Sin asignar"}</p>
      </div>
      <div>
        <p className="text-sm text-muted-foreground">Paradas</p>
        <p>{route.stops.length}</p>
      </div>
      <div>
        <p className="text-sm text-muted-foreground">Completadas</p>
        <p>{completedStops}</p>
      </div>
      {route.notes && (
        <div className="md:col-span-2">
          <p className="text-sm text-muted-foreground">Notas</p>
          <p>{route.notes}</p>
        </div>
      )}
    </div>
  );
}
