"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { MachineType, MachineStatus } from "@prisma/client";
import { useEffect, useState } from "react";

import { createMachine } from "@/app/actions/createMachine";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type PdvWithCenter = {
  id: string;
  name: string;
  centerId: string;
};

type CenterBasic = {
  id: string;
  name: string;
};

const formSchema = z.object({
  code: z.string().min(2),
  model: z.string().optional(),
  serialNumber: z.string().optional(),
  type: z.nativeEnum(MachineType),
  status: z.nativeEnum(MachineStatus),
  centerId: z.string(),
  pdvId: z.string(),
  installedAt: z.string().optional(),
  customId: z.coerce.number().optional(),
});

export function NewMachineForm() {
  const router = useRouter();
  const [centers, setCenters] = useState<CenterBasic[]>([]);
  const [pdvList, setPdvList] = useState<PdvWithCenter[]>([]);
  const [selectedCenterId, setSelectedCenterId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      status: "ACTIVE",
      type: "SNACK",
    },
  });

  // Cargar centros
  useEffect(() => {
    fetch("/api/centers")
      .then((res) => res.json())
      .then(setCenters);
  }, []);

  // Cargar PDVs
  useEffect(() => {
    fetch("/api/pdvs")
      .then((res) => res.json())
      .then(setPdvList);
  }, []);

  const filteredPdvs = pdvList.filter(
    (loc) => loc.centerId === selectedCenterId
  );

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await createMachine(values);
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="code">Código</Label>
        <Input id="code" {...register("code")} />
        {errors.code && (
          <p className="text-xs text-red-500">{errors.code.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="customId">ID</Label>
        <Input id="customId" type="number" {...register("customId")} />
      </div>

      <div>
        <Label htmlFor="model">Modelo</Label>
        <Input id="model" {...register("model")} />
      </div>

      <div>
        <Label htmlFor="serialNumber">Número de serie</Label>
        <Input id="serialNumber" {...register("serialNumber")} />
      </div>

      <div>
        <Label>Tipo</Label>
        <Select
          onValueChange={(v) => setValue("type", v as MachineType)}
          defaultValue="SNACK"
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecciona tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="SNACK">Snack</SelectItem>
            <SelectItem value="DRINK">Bebida</SelectItem>
            <SelectItem value="COMBO">Combo</SelectItem>
            <SelectItem value="OTHER">Otro</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Estado</Label>
        <Select
          onValueChange={(v) => setValue("status", v as MachineStatus)}
          defaultValue="ACTIVE"
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecciona estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ACTIVE">Activa</SelectItem>
            <SelectItem value="OUT_OF_SERVICE">Fuera de servicio</SelectItem>
            <SelectItem value="RETIRED">Retirada</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Centro</Label>
        <Select
          onValueChange={(v) => {
            setValue("centerId", v);
            setSelectedCenterId(v);
            setValue("pdvId", ""); // Reset PDV
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecciona centro" />
          </SelectTrigger>
          <SelectContent>
            {centers.map((center) => (
              <SelectItem key={center.id} value={center.id}>
                {center.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.centerId && (
          <p className="text-xs text-red-500">{errors.centerId.message}</p>
        )}
      </div>

      {selectedCenterId && (
        <div>
          <Label>PDV</Label>
          <Select onValueChange={(v) => setValue("pdvId", v)}>
            <SelectTrigger>
              <SelectValue placeholder="Selecciona PDV" />
            </SelectTrigger>
            <SelectContent>
              {filteredPdvs.map((pos) => (
                <SelectItem key={pos.id} value={pos.id}>
                  {pos.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.pdvId && (
            <p className="text-xs text-red-500">{errors.pdvId.message}</p>
          )}
        </div>
      )}

      <div>
        <Label htmlFor="installedAt">Fecha de instalación</Label>
        <Input id="installedAt" type="date" {...register("installedAt")} />
      </div>

      <Button type="submit" disabled={isSubmitting}>
        Crear máquina
      </Button>
    </form>
  );
}
