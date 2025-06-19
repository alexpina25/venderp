// app/(routes)/invoices/page.tsx
import { db } from "@/lib/db";
import { getServerAuthSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";

export default async function InvoicesPage() {
    const session = await getServerAuthSession();
  const userId = session?.user?.id;

  const current = userId
    ? await db.user.findUnique({ where: { id: userId } })
    : null;

  if (!current || current.role !== "TENANT_ADMIN" || !current.tenantId) {
    redirect("/dashboard");
  }

  const invoices = await db.invoice.findMany({
    include: { center: true },
    orderBy: { issuedAt: "desc" },
  });

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">Facturación</h2>

      <div className="border rounded-lg p-4 bg-background shadow">
        {invoices.length === 0 ? (
          <p className="text-muted-foreground">
            No hay facturas registradas aún.
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b">
                <th className="py-2">Centro</th>
                <th className="py-2">Fecha</th>
                <th className="py-2">Estado</th>
                <th className="py-2">Importe</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => (
                <tr
                  key={invoice.id}
                  className="border-b hover:bg-muted transition"
                >
                  <td className="py-2">{invoice.center?.name ?? "N/A"}</td>
                  <td className="py-2">
                    {format(new Date(invoice.issuedAt), "PPP", { locale: es })}
                  </td>
                  <td className="py-2">
                    <Badge variant={getStatusVariant(invoice.status)}>
                      {invoice.status}
                    </Badge>
                  </td>
                  <td className="py-2 font-medium">
                    {invoice.amount.toFixed(2)} {invoice.currency}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

// 🔧 Función para personalizar el estilo del estado
function getStatusVariant(status: string) {
  switch (status) {
    case "PAID":
      return "default";
    case "PENDING":
      return "default";
    case "CANCELLED":
      return "outline";
    case "OVERDUE":
      return "destructive";
    default:
      return "secondary";
  }
}
