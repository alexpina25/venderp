"use client";
import { useState, useEffect } from "react";
import { MasterInfo } from "@/components/masters/detail/MasterInfo";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/use-toast";
import { MasterWithRelations } from "@/types";

async function fetchMasterData(id: string) {
  const res = await fetch(`/api/masters/${id}`);
  if (!res.ok) {
    throw new Error("Error fetching master data");
  }
  return res.json();
}

export default function MasterDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const [master, setMaster] = useState<MasterWithRelations | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMasterData(params.id)
      .then(setMaster)
      .catch(() => {
        toast({
          variant: "destructive",
          title: "Error",
          description: "No se pudo cargar el master",
        });
      })
      .finally(() => setLoading(false));
  }, [params.id]);

  return (
    <div className="p-6 space-y-8">
      <h2 className="text-2xl font-bold">Detalle de Master</h2>
      {loading && (
        <div className="flex justify-center py-10">
          <Spinner />
        </div>
      )}
      {!loading && master && <MasterInfo master={master} />}
    </div>
  );
}
