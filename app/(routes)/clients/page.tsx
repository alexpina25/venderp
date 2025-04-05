// app/(routes)/clients/page.tsx
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function ClientsPage() {
  const clients = await db.client.findMany({
    include: {
      machines: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Clientes / Ubicaciones</h2>
        <Button asChild>
          <Link href="/clients/new">+ Nuevo cliente</Link>
        </Button>
      </div>

      <div className="border rounded-lg p-4 bg-background shadow">
        {clients.length === 0 ? (
          <p className="text-muted-foreground">
            No hay ubicaciones registradas aún.
          </p>
        ) : (
          <ul className="divide-y">
            {clients.map((client) => (
              <li
                key={client.id}
                className="py-4 flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold">{client.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {client.address}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Contacto: {client.contactName} · {client.contactPhone}
                  </p>
                </div>
                <span className="text-sm text-muted-foreground">
                  {client.machines.length} máquina
                  {client.machines.length !== 1 && "s"}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
