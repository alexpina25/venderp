"use client";

import { Center } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Pencil, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";
import * as Dialog from "@radix-ui/react-dialog";

interface Props {
  center: Center;
  onEdit: (center: Center) => void;
}

export function CenterInfo({ center, onEdit }: Props) {
  const router = useRouter();

  const handleDelete = async () => {
    const res = await fetch(`/api/centers/${center.id}/delete`, {
      method: "POST",
    });

    if (res.ok) {
      toast({ title: "Centro eliminado correctamente" });
      router.push("/centers");
      router.refresh();
    } else {
      const data = await res.json();
      toast({
        title: "No se pudo eliminar el centro",
        description: data.error ?? "Error desconocido",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-6 bg-background rounded-lg p-4 border">
      <div className="col-span-2 mt-4 flex gap-2">
        <Button size="sm" onClick={() => onEdit(center)}>
          <Pencil className="w-4 h-4 mr-2" />
          Editar
        </Button>

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
                ¿Estás seguro de que quieres eliminar este centro? Esta acción no se puede deshacer.
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
        <p className="text-sm text-muted-foreground">Nombre</p>
        <p className="font-medium">{center.name}</p>
      </div>
      <div>
        <p className="text-sm text-muted-foreground">Dirección</p>
        <p>
          {center.address}, {center.city}
        </p>
      </div>
      <div>
        <p className="text-sm text-muted-foreground">Contacto</p>
        <p>
          {center.contactName}
          {center.contactPhone ? ` (${center.contactPhone})` : ""}
        </p>
      </div>
      <div>
        <p className="text-sm text-muted-foreground">Email</p>
        <p>{center.contactEmail || "-"}</p>
      </div>
      {center.notes && (
        <div className="md:col-span-2">
          <p className="text-sm text-muted-foreground">Notas</p>
          <p>{center.notes}</p>
        </div>
      )}
    </div>
  );
}
