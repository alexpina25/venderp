"use client";

import Link from "next/link";
import { StopWithPOS } from "@/types";
import { Button } from "@/components/ui/button";
import { CheckCircle, AlertCircle } from "lucide-react";

interface Props {
  stop: StopWithPOS;
}

export function ManageStopLink({ stop }: Props) {
  const completed =
    stop.cashCollected !== null ||
    stop.walletReload !== null ||
    stop.notes !== null ||
    stop.maintenanceNotes !== null ||
    stop.priceChangeNotes !== null;

  return (
    <Button asChild variant="secondary" size="sm">
      <Link href={`/stops/${stop.id}`}>
        {completed ? (
          <CheckCircle className="w-4 h-4 mr-1" />
        ) : (
          <AlertCircle className="w-4 h-4 mr-1" />
        )}
        Gestionar parada
      </Link>
    </Button>
  );
}