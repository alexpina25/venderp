"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { MachineType, MachineStatus } from "@prisma/client";

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
import { toast } from "@/components/ui/use-toast";


const formSchema = z.object({
  model: z.string().optional(),
  serialNumber: z.string().optional(),
  type: z.nativeEnum(MachineType),
  status: z.nativeEnum(MachineStatus),
  installedAt: z.string().optional(),
});

export function NewMachineForm({ onSuccess }: { onSuccess?: () => void }) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      status: "ACTIVE",
      type: "SNACK",
    },
  });


  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await createMachine(values);
      toast({ title: "Máquina creada" });
      router.refresh();
      onSuccess?.();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error al crear máquina",
        description: "No se pudo crear la máquina.",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
            <SelectItem value="NOT_INSTALLED">Sin instalar</SelectItem>
          </SelectContent>
        </Select>
      </div>


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
