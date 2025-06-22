"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { StopWithPOS } from "@/types";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { StopDetailForm } from "@/components/routes/detail/StopDetailForm";
import { updateRouteStop } from "@/app/actions/updateRouteStop";

async function fetchStop(id: string): Promise<StopWithPOS> {
  const res = await fetch(`/api/stops/${id}`);
  if (!res.ok) throw new Error("Error fetching stop");
  return res.json();
}

export default function ManageStopPage({ params }: { params: { id: string } }) {
  const [stop, setStop] = useState<StopWithPOS | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchStop(params.id).then(setStop).catch(console.error);
  }, [params.id]);

  const handleSubmit = async (values: any) => {
    await updateRouteStop({ id: params.id, ...values });
    if (stop) {
      router.push(`/routes/${stop.routeId}`);
    } else {
      router.push("/routes");
    }
  };

  if (!stop) {
    return (
      <div className="flex justify-center py-10">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-2">
        <Button asChild size="icon" variant="outline">
          <Link href={`/routes/${stop.routeId}`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h2 className="text-2xl font-bold">Gestionar parada</h2>
      </div>
      <div className="bg-background rounded-lg p-4 border">
        <StopDetailForm
          onSubmit={handleSubmit}
          initialData={stop}
          posId={stop.pos.id}
        />
      </div>
    </div>
  );
}
