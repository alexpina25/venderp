import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { EditClientForm } from "@/components/clients/EditClientForm";

interface EditPageProps {
  params: { id: string };
}

export default async function EditClientPage({ params }: EditPageProps) {
  const client = await db.client.findUnique({
    where: { id: params.id },
  });

  if (!client) return notFound();

  return (
    <div className="p-6 max-w-xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold">Editar cliente</h2>
      <EditClientForm client={client} />
    </div>
  );
}
