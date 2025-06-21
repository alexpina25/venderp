"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

interface StopDetailFormProps {
  onSubmit: (data: any) => void;
  initialData?: any;
}

export function StopDetailForm({
  onSubmit,
  initialData = {},
}: StopDetailFormProps) {
  const [cashCollected, setCashCollected] = useState(
    initialData.cashCollected || ""
  );
  const [walletReload, setWalletReload] = useState(
    initialData.walletReload || ""
  );
  const [manualDownload, setManualDownload] = useState(
    initialData.manualDownload || ""
  );
  const [moneyNotes, setMoneyNotes] = useState(initialData.moneyNotes || "");
  const [maintenance, setMaintenance] = useState(
    initialData.maintenance || false
  );
  const [maintenanceNotes, setMaintenanceNotes] = useState(
    initialData.maintenanceNotes || ""
  );
  const [maintenanceResolved, setMaintenanceResolved] = useState(
    initialData.maintenanceResolved || false
  );
  const [priceChangeNotes, setPriceChangeNotes] = useState(
    initialData.priceChangeNotes || ""
  );
  const [replenished, setReplenished] = useState(
    initialData.replenished || false
  );
  const [replenishmentNotes, setReplenishmentNotes] = useState(
    initialData.replenishmentNotes || ""
  );
  const [visitTime, setVisitTime] = useState(initialData.visitTime || "");
  const [incidentNotes, setIncidentNotes] = useState(
    initialData.incidentNotes || ""
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      cashCollected,
      walletReload,
      manualDownload,
      moneyNotes,
      maintenance,
      maintenanceNotes,
      maintenanceResolved,
      priceChangeNotes,
      replenished,
      replenishmentNotes,
      visitTime,
      incidentNotes,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Recaudación</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <Input
            type="number"
            placeholder="€ Recogido (hucha/tubos)"
            value={cashCollected}
            onChange={(e) => setCashCollected(e.target.value)}
          />
          <Input
            type="number"
            placeholder="€ Recargado en tubos"
            value={walletReload}
            onChange={(e) => setWalletReload(e.target.value)}
          />
          <Input
            type="number"
            placeholder="€ Descargado manualmente"
            value={manualDownload}
            onChange={(e) => setManualDownload(e.target.value)}
          />
          <Textarea
            placeholder="Notas sobre dinero"
            value={moneyNotes}
            onChange={(e) => setMoneyNotes(e.target.value)}
          />
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="text-lg font-semibold">Reposición</h3>
        <div className="flex items-center space-x-4">
          <Label>¿Se hizo reposición?</Label>
          <Switch checked={replenished} onCheckedChange={setReplenished} />
        </div>
        {replenished && (
          <Textarea
            placeholder="Notas sobre reposición (productos repuestos, retirados, etc.)"
            value={replenishmentNotes}
            onChange={(e) => setReplenishmentNotes(e.target.value)}
          />
        )}
      </div>

      <Separator />

      <div>
        <h3 className="text-lg font-semibold">Mantenimiento</h3>
        <div className="flex items-center space-x-4">
          <Label>¿Se hizo mantenimiento?</Label>
          <Switch checked={maintenance} onCheckedChange={setMaintenance} />
        </div>
        {maintenance && (
          <>
            <Textarea
              placeholder="Notas de mantenimiento"
              value={maintenanceNotes}
              onChange={(e) => setMaintenanceNotes(e.target.value)}
            />
            <div className="flex items-center space-x-4">
              <Label>¿Resuelto?</Label>
              <Switch
                checked={maintenanceResolved}
                onCheckedChange={setMaintenanceResolved}
              />
            </div>
          </>
        )}
      </div>

      <Separator />

      <div>
        <h3 className="text-lg font-semibold">Otros</h3>
        <Textarea
          placeholder="Cambio de precios u otras incidencias"
          value={priceChangeNotes}
          onChange={(e) => setPriceChangeNotes(e.target.value)}
        />
        <Input
          type="time"
          value={visitTime}
          onChange={(e) => setVisitTime(e.target.value)}
        />
        <Textarea
          placeholder="Notas de incidente o subida de imágenes"
          value={incidentNotes}
          onChange={(e) => setIncidentNotes(e.target.value)}
        />
      </div>

      <Button type="submit">Guardar detalles</Button>
    </form>
  );
}
