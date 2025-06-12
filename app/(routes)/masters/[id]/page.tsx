"use client";
import { useState, useEffect } from "react";
import { MasterInfo } from "@/components/masters/detail/MasterInfo";

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
  const [master, setMaster] = useState<any | null>(null);

  useEffect(() => {
    fetchMasterData(params.id)
      .then(setMaster)
      .catch((err) => console.error(err));
  }, [params.id]);

  return (
    <div className="p-6 space-y-8">
      <h2 className="text-2xl font-bold">Detalle de Master</h2>
      {master && <MasterInfo master={master} />}
    </div>
  );
}
