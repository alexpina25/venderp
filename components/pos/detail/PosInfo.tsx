import { POS, Center, Master } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";

interface Props {
  pos: POS & { center: Center; master?: Master | null };
  onEdit: (pos: POS & { center: Center; master?: Master | null }) => void;
}

export function PosInfo({ pos, onEdit }: Props) {
  return (
    <div className="grid md:grid-cols-2 gap-6 bg-background rounded-lg p-4 border">
      <div className="col-span-2 mt-4 flex">
        <Button size="sm" onClick={() => onEdit(pos)}>
          <Pencil className="w-4 h-4 mr-2" />
          Editar
        </Button>
      </div>
      <div>
        <p className="text-sm text-muted-foreground">Nombre</p>
        <p className="font-medium">{pos.name}</p>
      </div>
      <div>
        <p className="text-sm text-muted-foreground">Centro</p>
        <p>{pos.center.name}</p>
      </div>
      <div>
        <p className="text-sm text-muted-foreground">Dirección</p>
        <p>
          {pos.address}, {pos.city}
        </p>
      </div>
      <div>
        <p className="text-sm text-muted-foreground">Contacto</p>
        <p>
          {pos.contactName || "-"}
          {pos.contactPhone ? ` (${pos.contactPhone})` : ""}
        </p>
      </div>
      <div>
        <p className="text-sm text-muted-foreground">Master</p>
        <p>{pos.master ? pos.master.serialNumber : "-"}</p>
      </div>
    </div>
  );
}
