"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ChannelConfigurator } from "@/components/machines/detail/stock/ChannelConfigurator";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { MachineWithDetails } from "@/types";

async function fetchMachineData(id: string) {
  const res = await fetch(`/api/machines/${id}`);
  if (!res.ok) {
    throw new Error("Error fetching machine data");
  }
  return res.json();
}

export default function ChannelConfigPage({
  params,
}: {
  params: { id: string };
}) {
  const [machine, setMachine] = useState<MachineWithDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMachineData(params.id)
      .then(setMachine)
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [params.id]);

  return (
    <div className="p-6 space-y-8">
      <div className="flex items-center gap-2">
        <Button asChild variant="default" size="icon">
          <Link href={`/machines/${params.id}`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h2 className="text-2xl font-bold">Configurar canales</h2>
      </div>
      {loading && (
        <div className="flex justify-center py-10">
          <Spinner />
        </div>
      )}
      {!loading && machine && <ChannelConfigurator machine={machine} />}
    </div>
  );
}
