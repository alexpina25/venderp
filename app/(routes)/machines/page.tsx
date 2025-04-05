// app/(routes)/machines/page.tsx
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function MachinesPage() {
  const machines = await db.machine.findMany({
    include: {
      location: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Máquinas</h2>
        <Button asChild>
          <Link href="/machines/new">+ Nueva máquina</Link>
        </Button>
      </div>

      <div className="border rounded-lg p-4 bg-background shadow">
        {machines.length === 0 ? (
          <p className="text-muted-foreground">
            No hay máquinas registradas aún.
          </p>
        ) : (
          <ul className="space-y-2">
            {machines.map((m) => (
              <li
                key={m.id}
                className="border p-3 rounded-md flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold">
                    {m.code} – {m.model}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Ubicación: {m.location?.name ?? "Sin asignar"}
                  </p>
                </div>
                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full uppercase">
                  {m.status}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
