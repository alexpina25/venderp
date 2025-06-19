"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { EditUserForm } from "./EditUserForm";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { useState } from "react";

interface Props {
  user: {
    id: string;
    name: string;
    role: string;
        active: boolean;
    center?: { id: string; name: string } | null;
    pos?: { id: string; name: string } | null;
  };
  open?: boolean;
  onClose?: () => void;
  onSuccess?: () => void;
}

export function EditUserModal({ user, open, onClose, onSuccess }: Props) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = open !== undefined && onClose !== undefined;
  const dialogOpen = isControlled ? open : internalOpen;

  const handleClose = () => {
    if (isControlled) {
      onClose?.();
    } else {
      setInternalOpen(false);
    }
  };

  const handleSuccess = () => {
    onSuccess?.();
    handleClose();
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={isControlled ? onClose : setInternalOpen}>
      {!isControlled && (
        <DialogTrigger asChild>
          <Button variant="outline" size="icon">
            <Pencil className="w-4 h-4" />
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Editar usuario</DialogTitle>
        </DialogHeader>
        <EditUserForm user={user} onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  );
}