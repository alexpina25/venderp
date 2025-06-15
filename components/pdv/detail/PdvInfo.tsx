import { PDV, Center, Master } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";

interface Props {
  pdv: PDV & { center: Center; master?: Master | null };
  onEdit: (pdv: PDV & { center: Center; master?: Master | null }) => void;
}

export function PdvInfo({ pdv, onEdit }: Props) {
  return (
    <div className="grid md:grid-cols-2 gap-6 bg-background rounded-lg p-4 border">
        <div className="col-span-2 mt-4 flex">
          <Button size="sm" onClick={() => onEdit(pdv)}>
          <Pencil className="w-4 h-4 mr-2" />
          Editar
        </Button>
      </div>
      <div>
        <p className="text-sm text-muted-foreground">Nombre</p>
          <p className="font-medium">{pdv.name}</p>
      </div>
      <div>
        <p className="text-sm text-muted-foreground">Centro</p>
          <p>{pdv.center.name}</p>
      </div>
      <div>
        <p className="text-sm text-muted-foreground">Dirección</p>
        <p>
            {pdv.address}, {pdv.city}
        </p>
      </div>
      <div>
        <p className="text-sm text-muted-foreground">Contacto</p>
        <p>
            {pdv.contactName || "-"}
            {pdv.contactPhone ? ` (${pdv.contactPhone})` : ""}
        </p>
      </div>
      <div>
        <p className="text-sm text-muted-foreground">Master</p>
          <p>{pdv.master ? pdv.master.serialNumber : "-"}</p>
      </div>
    </div>
  );
}
