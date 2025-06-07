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
import { NewCenterForm } from "./NewCenterForm";

export function NewCenterModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default" size="sm" className="gap-1">
          <Plus className="w-4 h-4" />
          Nuevo centro
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Registrar nuevo centro</DialogTitle>
        </DialogHeader>

        <NewCenterForm />
      </DialogContent>
    </Dialog>
  );
}
