import { db } from "@/lib/db";
import { LocationTable } from "@/components/locations/LocationTable";
import { NewLocationModal } from "@/components/locations/forms/NewLocationModal";

export default async function LocationsPage() {
  const locations = await db.location.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      client: true, // Para poder ver a qué cliente pertenece cada ubicación
    },
  });

  return (
    <div className="p-6 space-y-6 bg-background">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Ubicaciones</h2>
        <NewLocationModal />
      </div>

      <LocationTable data={locations} />
    </div>
  );
}
