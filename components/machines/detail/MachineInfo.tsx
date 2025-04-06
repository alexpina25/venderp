import { Machine, Client, MachineStatus, MachineType } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { EditMachineModal } from "@/components/machines/EditMachineModal";

interface Props {
  machine: Machine & { location: Client };
  onEdit: (machine: Machine) => void; // Función para abrir el modal
}

export function MachineInfo({ machine, onEdit }: Props) {
  return (
    <div className="grid md:grid-cols-2 gap-6 bg-background rounded-lg p-4 border">
      <div>
        <p className="text-sm text-muted-foreground">Código</p>
        <p className="font-medium">{machine.code}</p>
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
        <p className="text-sm text-muted-foreground">Ubicación</p>
        <p>{machine.location.name}</p>
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

      {/* Botón de Editar */}
      <div className="col-span-2 mt-4 flex justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(machine)} // Llama a la función para abrir el modal
        >
          <Pencil className="w-4 h-4 mr-2" />
          Editar
        </Button>
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
