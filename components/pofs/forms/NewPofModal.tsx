"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { NewPofForm } from "./NewPofForm";

export function NewPofModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default" size="sm" className="gap-1">
          <Plus className="w-4 h-4" />
          Nuevo POF
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Registrar nuevo POF</DialogTitle>
        </DialogHeader>

        <NewPofForm />
      </DialogContent>
    </Dialog>
  );
}
