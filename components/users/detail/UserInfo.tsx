"use client";

import { User } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Pencil, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";
import * as Dialog from "@radix-ui/react-dialog";
import { ChangePasswordModal } from "../forms/ChangePasswordModal";

interface Props {
  user: User & {
    center?: { id: string; name: string } | null;
    pos?: { id: string; name: string } | null;
  };
  onEdit: () => void;
}

export function UserInfo({ user, onEdit }: Props) {
  const router = useRouter();

  const handleDelete = async () => {
    const res = await fetch(`/api/users/${user.id}/delete`, { method: "POST" });

    if (res.ok) {
      toast({ title: "Usuario eliminado correctamente" });
      router.push("/users");
      router.refresh();
    } else {
      const data = await res.json();
      toast({
        title: "No se pudo eliminar el usuario",
        description: data.error ?? "Error desconocido",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-6 bg-background rounded-lg p-4 border">
      <div className="col-span-2 mt-4 flex gap-2">
        <Button size="sm" onClick={() => onEdit()}>
          <Pencil className="w-4 h-4 mr-2" />
          Editar
        </Button>
        <ChangePasswordModal userId={user.id} />
        <Dialog.Root>
          <Dialog.Trigger asChild>
            <Button size="sm" variant="destructive">
              <Trash className="w-4 h-4 mr-2" />
              Eliminar
            </Button>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/40 z-50" />
            <Dialog.Content className="fixed z-50 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-zinc-900 p-6 rounded-md w-[90%] max-w-md">
              <Dialog.Title className="text-lg font-medium">
                Confirmar eliminación
              </Dialog.Title>
              <Dialog.Description className="mt-2 text-sm text-muted-foreground">
                ¿Estás seguro de que quieres eliminar este usuario? Esta acción
                no se puede deshacer.
              </Dialog.Description>
              <div className="mt-4 flex justify-end gap-2">
                <Dialog.Close asChild>
                  <Button variant="outline">Cancelar</Button>
                </Dialog.Close>
                <Dialog.Close asChild>
                  <Button variant="destructive" onClick={handleDelete}>
                    Eliminar
                  </Button>
                </Dialog.Close>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>
      <div>
        <p className="text-sm text-muted-foreground">Usuario</p>
        <p className="font-medium">{user.email}</p>
      </div>
      <div>
        <p className="text-sm text-muted-foreground">Nombre</p>
        <p>{user.name}</p>
      </div>
      <div>
        <p className="text-sm text-muted-foreground">Rol</p>
        <p>{user.role}</p>
      </div>
      {user.center && (
        <div>
          <p className="text-sm text-muted-foreground">Centro</p>
          <p>{user.center.name}</p>
        </div>
      )}
      {user.pos && (
        <div>
          <p className="text-sm text-muted-foreground">PDV</p>
          <p>{user.pos.name}</p>
        </div>
      )}
    </div>
  );
}
