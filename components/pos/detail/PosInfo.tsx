import { POS, Center, Master } from "@prisma/client";

interface Props {
  pos: POS & { center: Center; master?: Master | null };
}

export function PosInfo({ pos }: Props) {
  return (
    <div className="grid md:grid-cols-2 gap-6 bg-background rounded-lg p-4 border">
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
