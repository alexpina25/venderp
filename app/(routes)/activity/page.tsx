// app/(routes)/activity/page.tsx
import { db } from "@/lib/db";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";

export default async function ActivityPage() {
  const logs = await db.activityLog.findMany({
    include: { user: true },
    orderBy: { timestamp: "desc" },
    take: 50, // limitar resultados recientes
  });

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">Registro de Actividad</h2>

      <div className="border rounded-lg p-4 bg-background shadow">
        {logs.length === 0 ? (
          <p className="text-muted-foreground">
            No hay actividad registrada aún.
          </p>
        ) : (
          <ul className="space-y-4">
            {logs.map((log) => (
              <li key={log.id} className="border p-3 rounded-md">
                <div className="flex justify-between items-center">
                  <p className="text-sm">
                    <span className="font-semibold">
                      {log.user?.name ?? "Usuario desconocido"}
                    </span>{" "}
                    realizó <Badge variant="outline">{log.action}</Badge> sobre{" "}
                    <strong>{log.entity}</strong>
                  </p>
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(log.timestamp), "dd MMM yyyy HH:mm", {
                      locale: es,
                    })}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  ID afectado: <code>{log.entityId}</code>
                </p>
                {log.changes && (
                  <pre className="text-xs mt-2 bg-muted rounded-md p-2 overflow-auto">
                    {JSON.stringify(log.changes, null, 2)}
                  </pre>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
