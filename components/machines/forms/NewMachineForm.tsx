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

type LocationWithClient = {
  id: string;
  name: string;
  clientId: string;
};

type ClientBasic = {
  id: string;
  name: string;
};

const formSchema = z.object({
  code: z.string().min(2),
  model: z.string().optional(),
  serialNumber: z.string().optional(),
  type: z.nativeEnum(MachineType),
  status: z.nativeEnum(MachineStatus),
  clientId: z.string(),
  locationId: z.string(),
  installedAt: z.string().optional(),
  customId: z.coerce.number().optional(),
});

export function NewMachineForm() {
  const router = useRouter();
  const [clients, setClients] = useState<ClientBasic[]>([]);
  const [locations, setLocations] = useState<LocationWithClient[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);

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

  // Cargar clientes
  useEffect(() => {
    fetch("/api/clients")
      .then((res) => res.json())
      .then(setClients);
  }, []);

  // Cargar ubicaciones
  useEffect(() => {
    fetch("/api/locations")
      .then((res) => res.json())
      .then(setLocations);
  }, []);

  const filteredLocations = locations.filter(
    (loc) => loc.clientId === selectedClientId
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
        <Label>Cliente</Label>
        <Select
          onValueChange={(v) => {
            setValue("clientId", v);
            setSelectedClientId(v);
            setValue("locationId", ""); // Reset location
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecciona cliente" />
          </SelectTrigger>
          <SelectContent>
            {clients.map((client) => (
              <SelectItem key={client.id} value={client.id}>
                {client.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.clientId && (
          <p className="text-xs text-red-500">{errors.clientId.message}</p>
        )}
      </div>

      {selectedClientId && (
        <div>
          <Label>Ubicación</Label>
          <Select onValueChange={(v) => setValue("locationId", v)}>
            <SelectTrigger>
              <SelectValue placeholder="Selecciona ubicación" />
            </SelectTrigger>
            <SelectContent>
              {filteredLocations.map((location) => (
                <SelectItem key={location.id} value={location.id}>
                  {location.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.locationId && (
            <p className="text-xs text-red-500">{errors.locationId.message}</p>
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
