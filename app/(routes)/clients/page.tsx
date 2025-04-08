import { db } from "@/lib/db";
import { ClientTable } from "@/components/clients/ClientTable";
import { NewClientModal } from "@/components/clients/forms/NewClientModal";

export default async function ClientsPage() {
  const clients = await db.client.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-6 space-y-6 bg-background">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Clientes</h2>
        <NewClientModal />
      </div>

      <ClientTable data={clients} />
    </div>
  );
}
