import { Center } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";

interface Props {
  center: Center;
  onEdit: (center: Center) => void;
}

export function CenterInfo({ center, onEdit }: Props) {
  return (
    <div className="grid md:grid-cols-2 gap-6 bg-background rounded-lg p-4 border">
      <div className="col-span-2 mt-4 flex">
        <Button size="sm" onClick={() => onEdit(center)}>
          <Pencil className="w-4 h-4 mr-2" />
          Editar
        </Button>
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
