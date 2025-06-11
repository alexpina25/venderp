import { POF, Center } from "@prisma/client";

interface Props {
  pof: POF & { center: Center };
}

export function PofInfo({ pof }: Props) {
  return (
    <div className="grid md:grid-cols-2 gap-6 bg-background rounded-lg p-4 border">
      <div>
        <p className="text-sm text-muted-foreground">Nombre</p>
        <p className="font-medium">{pof.name}</p>
      </div>
      <div>
        <p className="text-sm text-muted-foreground">Centro</p>
        <p>{pof.center.name}</p>
      </div>
      <div>
        <p className="text-sm text-muted-foreground">Dirección</p>
        <p>
          {pof.address}, {pof.city}
        </p>
      </div>
      <div>
        <p className="text-sm text-muted-foreground">Contacto</p>
        <p>
          {pof.contactName || "-"}
          {pof.contactPhone ? ` (${pof.contactPhone})` : ""}
        </p>
      </div>
    </div>
  );
}
