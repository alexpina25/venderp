"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { EditLocationForm } from "./EditLocationForm";
import { Location, Client } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { useState } from "react";

// Extendemos si necesitas más relaciones (por ejemplo, client)
interface EditLocationModalProps {
  location: Location & {
    client: Client;
  };
}

export function EditLocationModal({ location }: EditLocationModalProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Pencil className="w-4 h-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Editar ubicación</DialogTitle>
        </DialogHeader>

        <EditLocationForm location={location} onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
