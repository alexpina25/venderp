// app/(routes)/settings/page.tsx
import { db } from "@/lib/db";
import { getServerAuthSession } from "@/lib/auth";
import { Badge } from "@/components/ui/badge";

export default async function SettingsPage() {

  const session = await getServerAuthSession();
  const userId = session?.user?.id;

  const user = await db.user.findUnique({
    where: { id: userId || undefined },
    include: {
      tenant: true,
    },
  });

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">Configuración</h2>

      <div className="space-y-4 border rounded-lg p-4 bg-background shadow">
        <h3 className="text-lg font-semibold">Organización</h3>

        <div className="text-sm space-y-1">
          <p>
            <strong>Nombre:</strong> {user?.tenant?.name ?? "Sin asignar"}
          </p>
          <p>
            <strong>Usuario actual:</strong> {user?.email}
          </p>
          <p>
            <strong>Rol:</strong>{" "}
            <Badge variant="outline">{user?.role ?? "Desconocido"}</Badge>
          </p>
        </div>
      </div>

      <div className="space-y-4 border rounded-lg p-4 bg-background shadow">
        <h3 className="text-lg font-semibold">Preferencias del sistema</h3>
        <p className="text-sm text-muted-foreground">
          Aquí podrás configurar idioma, zona horaria, moneda, etc.
        </p>
      </div>

      <div className="space-y-4 border rounded-lg p-4 bg-background shadow">
        <h3 className="text-lg font-semibold">Gestión de usuarios</h3>
        <p className="text-sm text-muted-foreground">
          En futuras versiones podrás gestionar usuarios internos, invitar
          nuevos operadores o cambiar roles.
        </p>
      </div>
    </div>
  );
}
