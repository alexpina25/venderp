"use client";

import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { POS, Machine, Master } from "@prisma/client";
import { updatePos } from "@/app/actions/updatePos"; // Asegúrate de tener esta acción creada

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

const formSchema = z.object({
  id: z.string(),
  name: z.string().min(2),
  address: z.string().min(2),
  notes: z.string().optional(),
  machineId: z.string().optional(),
  masterId: z.string().optional(),
});

interface Props {
  pos: POS & { machine?: Machine | null; master?: Master | null };
  onSuccess?: () => void;
}

export function EditPosForm({ pos, onSuccess }: Props) {
  const router = useRouter();
  const [machines, setMachines] = useState<Machine[]>([]);
  const [masters, setMasters] = useState<Master[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: pos.id,
      name: pos.name,
      address: pos.address,
      notes: pos.notes ?? "",
      machineId: pos.machine ? pos.machine.id : "",
      masterId: pos.master ? pos.master.id : "",
    },
  });

  useEffect(() => {
    fetch("/api/machines")
      .then((res) => res.json())
      .then(setMachines);
    fetch("/api/masters/auth")
      .then((res) => res.json())
      .then(setMasters);
  }, []);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await updatePos({
      ...values,
      machineId: values.machineId || undefined,
      masterId: values.masterId || undefined,
    });
    router.refresh();
    onSuccess?.();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <input type="hidden" {...register("id")} />

      <div>
        <Label htmlFor="name">Nombre</Label>
        <Input id="name" {...register("name")} />
        {errors.name && (
          <p className="text-xs text-red-500">{errors.name.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="address">Ubicación</Label>
        <Input id="address" {...register("address")} />
      </div>

      <div>
        <Label>Máquina</Label>
        <Select
          defaultValue={pos.machine ? pos.machine.id : undefined}
          onValueChange={(v) => setValue("machineId", v)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecciona máquina" />
          </SelectTrigger>
          <SelectContent>
            {machines.map((m) => (
              <SelectItem key={m.id} value={m.id}>
                {m.customId ?? m.id}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Master</Label>
        <Select
          defaultValue={pos.master ? pos.master.id : undefined}
          onValueChange={(v) => setValue("masterId", v)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecciona master" />
          </SelectTrigger>
          <SelectContent>
            {masters.map((m) => (
              <SelectItem key={m.id} value={m.id}>
                {m.serialNumber}
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
        Guardar cambios
      </Button>
    </form>
  );
}
