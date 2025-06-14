import { db } from "@/lib/db";
import { CenterTable } from "@/components/centers/CenterTable";
import { NewCenterModal } from "@/components/centers/forms/NewCenterModal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default async function CentersPage() {
  const centers = await db.center.findMany({
    where: { subCenters: { none: {} } },
    orderBy: { name: "desc" },
  });

  const parentCenters = await db.center.findMany({
    where: { subCenters: { some: {} } },
    orderBy: { name: "desc" },
  });

  return (
    <div className="p-6 space-y-6 bg-background">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Centros</h2>
        <NewCenterModal />
      </div>

      <Tabs defaultValue="centros" className="space-y-4">
        <TabsList>
          <TabsTrigger value="centros">Centros</TabsTrigger>
          <TabsTrigger value="padres">Centros padre</TabsTrigger>
        </TabsList>
        <TabsContent value="centros">
          <CenterTable data={centers} />
        </TabsContent>
        <TabsContent value="padres">
          <CenterTable data={parentCenters} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
