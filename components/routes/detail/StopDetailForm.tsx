"use client";

import { useState } from "react";
import { StopProductsList } from "./StopProductsList";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UploadButton } from "@/utils/uploadthing";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

interface StopDetailFormProps {
  onSubmit: (data: any) => void;
  initialData?: any;
  posId: string;
}

export function StopDetailForm({
  onSubmit,
  initialData = {},
  posId,
}: StopDetailFormProps) {
  const [step, setStep] = useState(1);

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

  const [replenished, setReplenished] = useState(
    initialData.replenished || false
  );
  const [replenishmentNotes, setReplenishmentNotes] = useState(
    initialData.replenishmentNotes || ""
  );

  const [maintenance, setMaintenance] = useState(
    initialData.maintenance || false
  );
  const [maintenanceNotes, setMaintenanceNotes] = useState(
    initialData.maintenanceNotes || ""
  );
  const [maintenanceResolved, setMaintenanceResolved] = useState(
    initialData.maintenanceResolved || false
  );

  const [visitTime, setVisitTime] = useState(initialData.visitTime || "");
  const [priceChangeNotes, setPriceChangeNotes] = useState(
    initialData.priceChangeNotes || ""
  );
  const [incidentMedia, setIncidentMedia] = useState<string[]>([]);

  const handleNext = (e?: React.MouseEvent) => {
    e?.preventDefault();
    setStep((prev) => Math.min(prev + 1, 4));
  };
  const handleBack = (e?: React.MouseEvent) => {
    e?.preventDefault();
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      cashCollected,
      walletReload,
      manualDownload,
      moneyNotes,
      replenished,
      replenishmentNotes,
      maintenance,
      maintenanceNotes,
      maintenanceResolved,
      visitTime,
      priceChangeNotes,
      incidentMedia,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 mx-auto">
      {/* Step indicators */}
      <div className="text-sm text-muted-foreground mb-2">
        {/* Mobile: show only current step */}
        <div className="sm:hidden font-bold text-primary">
          {
            ["Recaudación", "Reposición", "Mantenimiento", "Finalizar"][
              step - 1
            ]
          }
        </div>
        {/* Desktop: show all steps */}
        <div className="hidden sm:flex justify-between">
          {["Recaudación", "Reposición", "Mantenimiento", "Finalizar"].map(
            (label, i) => (
              <span
                key={i}
                className={i + 1 === step ? "font-bold text-primary" : ""}
              >
                {label}
              </span>
            )
          )}
        </div>
      </div>

      <Separator />

      {step === 1 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Recaudación</h3>
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
      )}

      {step === 2 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Reposición</h3>
          <StopProductsList posId={posId} />
          <div className="flex items-center space-x-3">
            <Label>¿Se repuso producto?</Label>
            <Switch checked={replenished} onCheckedChange={setReplenished} />
          </div>
          {replenished && (
            <Textarea
              placeholder="Notas sobre productos repuestos, retirados, etc."
              value={replenishmentNotes}
              onChange={(e) => setReplenishmentNotes(e.target.value)}
            />
          )}
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Mantenimiento</h3>
          <div className="flex items-center space-x-3">
            <Label>¿Hubo intervención técnica?</Label>
            <Switch checked={maintenance} onCheckedChange={setMaintenance} />
          </div>
          {maintenance && (
            <>
              <Textarea
                placeholder="Descripción del mantenimiento"
                value={maintenanceNotes}
                onChange={(e) => setMaintenanceNotes(e.target.value)}
              />
              <div className="flex items-center space-x-3">
                <Label>¿Resuelto?</Label>
                <Switch
                  checked={maintenanceResolved}
                  onCheckedChange={setMaintenanceResolved}
                />
              </div>
            </>
          )}
        </div>
      )}

      {step === 4 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Finalizar parada</h3>
          <Input
            type="time"
            value={visitTime}
            onChange={(e) => setVisitTime(e.target.value)}
            placeholder="Hora visita"
          />
          <Textarea
            placeholder="Notas sobre precios u otras incidencias"
            value={priceChangeNotes}
            onChange={(e) => setPriceChangeNotes(e.target.value)}
          />
          <UploadButton
            endpoint="profileImage"
            onClientUploadComplete={(res) =>
              setIncidentMedia(res.map((f) => f.url))
            }
            onUploadError={(e) => alert(`Error al subir archivo: ${e.message}`)}
          />
        </div>
      )}

      {/* Navigation buttons */}
      <div className="flex justify-between pt-4">
        {step > 1 ? (
          <Button
            variant="outline"
            type="button"
            onClick={(e) => handleBack(e)}
          >
            Atrás
          </Button>
        ) : (
          <span />
        )}

        {step < 4 ? (
          <Button type="button" onClick={(e) => handleNext(e)}>
            Siguiente
          </Button>
        ) : (
          <Button type="submit">Guardar parada</Button>
        )}
      </div>
    </form>
  );
}
