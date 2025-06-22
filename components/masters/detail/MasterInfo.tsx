import { Master, POS, Tenant } from "@prisma/client";

interface Props {
  master: Master & { pos: POS | null; tenant: Tenant };
}

export function MasterInfo({ master }: Props) {
  return (
    <div className="grid md:grid-cols-2 gap-6 bg-background rounded-lg p-4 border">
      <div>
        <p className="text-sm text-muted-foreground">Número de serie</p>
        <p className="font-medium">{master.serialNumber}</p>
      </div>
      <div>
        <p className="text-sm text-muted-foreground">PDV asociado</p>
        <p>{master.pos ? master.pos.name : "-"}</p>
      </div>
      <div>
        <p className="text-sm text-muted-foreground">Tenant</p>
        <p>{master.tenant.name}</p>
      </div>
    </div>
  );
}
