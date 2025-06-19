"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Key } from "lucide-react";
import { ChangePasswordForm } from "./ChangePasswordForm";

interface Props {
  userId: string;
}

export function ChangePasswordModal({ userId }: Props) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="secondary">
          <Key className="w-4 h-4 mr-2" />
          Cambiar contraseña
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Cambiar contraseña</DialogTitle>
        </DialogHeader>
        <ChangePasswordForm userId={userId} />
      </DialogContent>
    </Dialog>
  );
}