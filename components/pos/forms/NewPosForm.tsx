"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";

import { Center, Machine, Master } from "@prisma/client";
import { createPos } from "@/app/actions/createPos"; // 🛠️ Asegúrate de tener este action

const formSchema = z.object({
  code: z.string().min(2),
  name: z.string().min(2),
  address: z.string().min(2),
  city: z.string().min(2),
  notes: z.string().optional(),
  centerId: z.string().min(1, "Selecciona un centro"),
  machineId: z.string().optional(),
  masterId: z.string().optional(),
});

export function NewPosForm({ onSuccess }: { onSuccess?: () => void }) {
  const router = useRouter();
  const [centers, setCenters] = useState<Center[]>([]);
  const [machines, setMachines] = useState<Machine[]>([]);
  const [masters, setMasters] = useState<Master[]>([]);
  const [centerFilter, setCenterFilter] = useState("");
  const [machineFilter, setMachineFilter] = useState("");
  const [masterFilter, setMasterFilter] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  useEffect(() => {
    fetch("/api/centers")
      .then((res) => res.json())
      .then(setCenters);
  }, []);

  useEffect(() => {
    fetch("/api/machines")
      .then((res) => res.json())
      .then(setMachines);
    fetch("/api/masters/auth")
      .then((res) => res.json())
      .then(setMasters);
  }, []);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await createPos({
        ...values,
        machineId: values.machineId || undefined,
        masterId: values.masterId || undefined,
      });
      toast({ title: "PDV creado" });
      router.refresh();
      onSuccess?.();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error al crear PDV",
        description: "No se pudo crear el punto de venta.",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="code">Código</Label>
        <Input id="code" {...register("code")} />
      </div>
      <div>
        <Label htmlFor="name">Nombre</Label>
        <Input id="name" {...register("name")} />
      </div>

      <div>
        <Label htmlFor="address">Ubicación</Label>
        <Input id="address" {...register("address")} />
      </div>

      <div>
        <Label htmlFor="city">Ciudad</Label>
        <Input id="city" {...register("city")} />
      </div>

      <div>
        <Label>Centro asociado</Label>
        <Select onValueChange={(v) => setValue("centerId", v)}>
          <SelectTrigger>
            <SelectValue placeholder="Selecciona centro" />
          </SelectTrigger>
          <SelectContent>
            <div className="p-2">
              <Input
                placeholder="Buscar..."
                value={centerFilter}
                onChange={(e) => setCenterFilter(e.target.value)}
              />
            </div>
            {centers
              .filter(
                (c) =>
                  c.name.toLowerCase().includes(centerFilter.toLowerCase()) ||
                  String(c.customId ?? "").includes(centerFilter) ||
                  c.id.toLowerCase().includes(centerFilter.toLowerCase())
              )
              .map((center) => (
                <SelectItem key={center.id} value={center.id}>
                  {center.customId
                    ? `${center.customId} - ${center.name}`
                    : center.name}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
        {errors.centerId && (
          <p className="text-xs text-red-500 mt-1">{errors.centerId.message}</p>
        )}
      </div>

      <div>
        <Label>Máquina</Label>
        <Select onValueChange={(v) => setValue("machineId", v)}>
          <SelectTrigger>
            <SelectValue placeholder="Selecciona máquina" />
          </SelectTrigger>
          <SelectContent>
            <div className="p-2">
              <Input
                placeholder="Buscar..."
                value={machineFilter}
                onChange={(e) => setMachineFilter(e.target.value)}
              />
            </div>
            {machines
              .filter(
                (m) =>
                  String(m.customId ?? "").includes(machineFilter) ||
                  (m.model ?? "")
                    .toLowerCase()
                    .includes(machineFilter.toLowerCase()) ||
                  (m.serialNumber ?? "")
                    .toLowerCase()
                    .includes(machineFilter.toLowerCase()) ||
                  m.id.toLowerCase().includes(machineFilter.toLowerCase())
              )
              .map((m) => (
                <SelectItem key={m.id} value={m.id}>
                  {(m.customId ? `${m.customId}` : m.id) +
                    (m.model ? ` - ${m.model}` : "")}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Master</Label>
        <Select onValueChange={(v) => setValue("masterId", v)}>
          <SelectTrigger>
            <SelectValue placeholder="Selecciona master" />
          </SelectTrigger>
          <SelectContent>
            <div className="p-2">
              <Input
                placeholder="Buscar..."
                value={masterFilter}
                onChange={(e) => setMasterFilter(e.target.value)}
              />
            </div>
            {masters
              .filter(
                (m) =>
                  m.serialNumber
                    .toLowerCase()
                    .includes(masterFilter.toLowerCase()) ||
                  String(m.customId ?? "").includes(masterFilter) ||
                  m.id.toLowerCase().includes(masterFilter.toLowerCase())
              )
              .map((m) => (
                <SelectItem key={m.id} value={m.id}>
                  {(m.customId ? `${m.customId}` : m.id) +
                    ` - ${m.serialNumber}`}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="notes">Notas</Label>
        <Input id="notes" {...register("notes")} />
      </div>

      <Button type="submit" disabled={isSubmitting}>
        Crear ubicación
      </Button>
    </form>
  );
}
