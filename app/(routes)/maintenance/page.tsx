// app/(routes)/maintenance/page.tsx
import { db } from "@/lib/db";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";

export default async function MaintenancePage() {
  const logs = await db.maintenanceLog.findMany({
    include: {
      machine: true,
      operator: true,
    },
    orderBy: { date: "desc" },
  });

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">Historial de Mantenimientos</h2>

      <div className="border rounded-lg p-4 bg-background shadow">
        {logs.length === 0 ? (
          <p className="text-muted-foreground">
            Aún no se ha registrado ningún mantenimiento.
          </p>
        ) : (
          <ul className="space-y-4">
            {logs.map((log) => (
              <li
                key={log.id}
                className="border rounded-md p-4 hover:bg-muted transition"
              >
                <div className="flex justify-between items-center">
                  <p className="font-semibold">
                    {log.machine.customId ?? log.machine.id} – {log.machine.model}
                  </p>
                  <Badge
                    variant={
                      log.type === "CORRECTIVE" ? "destructive" : "default"
                    }
                  >
                    {log.type}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {format(new Date(log.date), "PPP", { locale: es })} · Técnico:{" "}
                  {log.operator?.name ?? "N/A"}
                </p>
                <p className="text-sm mt-2">{log.description}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
