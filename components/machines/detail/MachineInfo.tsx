import { MachineStatus, MachineType } from "@prisma/client";
import { MachineWithDetails } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";
import * as Dialog from "@radix-ui/react-dialog";
//import { EditMachineModal } from "@/components/machines/forms/EditMachineModal";

interface Props {
  machine: MachineWithDetails;
  onEdit: (machine: MachineWithDetails) => void;
}

export function MachineInfo({ machine, onEdit }: Props) {
    const router = useRouter();

  const handleDelete = async () => {
    const res = await fetch(`/api/machines/${machine.id}/delete`, { method: "POST" });

    if (res.ok) {
      toast({ title: "Máquina eliminada correctamente" });
      router.push("/machines");
      router.refresh();
    } else {
      const data = await res.json();
      toast({
        title: "No se pudo eliminar la máquina",
        description: data.error ?? "Error desconocido",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-6 bg-background rounded-lg p-4 border">
      {/* Botón de Editar */}
      <div className="col-span-2 mt-4 flex gap-2">
        <Button
          size="sm"
          onClick={() => onEdit(machine)}
        >
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
                ¿Estás seguro de que quieres eliminar esta máquina? Esta acción no se puede deshacer.
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
        <p className="text-sm text-muted-foreground">ID</p>
        <p className="font-medium">{machine.customId ?? machine.id}</p>
      </div>

      <div>
        <p className="text-sm text-muted-foreground">Modelo</p>
        <p>
          {machine.model || (
            <span className="italic text-muted-foreground">
              No especificado
            </span>
          )}
        </p>
      </div>

      <div>
        <p className="text-sm text-muted-foreground">Nº de serie</p>
        <p>
          {machine.serialNumber || (
            <span className="italic text-muted-foreground">No registrado</span>
          )}
        </p>
      </div>

      <div>
        <p className="text-sm text-muted-foreground">Tipo</p>
        <p>{getMachineType(machine.type)}</p>
      </div>

      <div>
        <p className="text-sm text-muted-foreground">Estado</p>
        <Badge variant={getStatusVariant(machine.status)}>
          {getStatusLabel(machine.status)}
        </Badge>
      </div>

      <div>
        <p className="text-sm text-muted-foreground">POS</p>
        <p>{machine.pos?.name ?? "–"}</p>
      </div>

      <div>
        <p className="text-sm text-muted-foreground">Instalada</p>
        <p>
          {machine.installedAt
            ? new Date(machine.installedAt).toLocaleDateString()
            : "–"}
        </p>
      </div>

      <div>
        <p className="text-sm text-muted-foreground">Última revisión</p>
        <p>
          {machine.lastCheck
            ? new Date(machine.lastCheck).toLocaleDateString()
            : "–"}
        </p>
      </div>
    </div>
  );
}

function getStatusLabel(status: MachineStatus) {
  switch (status) {
    case "ACTIVE":
      return "Activa";
    case "OUT_OF_SERVICE":
      return "Fuera de servicio";
    case "RETIRED":
      return "Retirada";
    case "NOT_INSTALLED":
      return "Sin instalar";
    default:
      return status;
  }
}

function getStatusVariant(status: MachineStatus) {
  switch (status) {
    case "ACTIVE":
      return "default";
    case "OUT_OF_SERVICE":
      return "destructive";
    case "RETIRED":
      return "secondary";
    case "NOT_INSTALLED":
      return "outline";
    default:
      return "outline";
  }
}

function getMachineType(type: MachineType) {
  switch (type) {
    case "SNACK":
      return "Snack";
    case "DRINK":
      return "Bebida";
    case "COMBO":
      return "Combinada";
    case "OTHER":
      return "Otro";
  }
}
