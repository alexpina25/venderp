"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Machine, MachineStatus, MachineType, Client } from "@prisma/client";
import { updateMachine } from "@/app/actions/updateMachine";

import {
  Input,
  Button,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";

const formSchema = z.object({
  id: z.string(),
  code: z.string().min(2),
  model: z.string().optional(),
  type: z.nativeEnum(MachineType),
  status: z.nativeEnum(MachineStatus),
  locationId: z.string(),
});

interface Props {
  machine: Machine;
  clients: Client[];
}

export function EditMachineForm({ machine, clients }: Props) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...machine,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await updateMachine(values);
    router.push("/machines");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <input type="hidden" {...register("id")} />

      <div>
        <Label htmlFor="code">Código</Label>
        <Input id="code" {...register("code")} />
        {errors.code && (
          <p className="text-xs text-red-500">{errors.code.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="model">Modelo</Label>
        <Input id="model" {...register("model")} />
      </div>

      <div>
        <Label>Tipo</Label>
        <Select
          defaultValue={machine.type}
          onValueChange={(v: string) => setValue("type", v as MachineType)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="SNACK">Snack</SelectItem>
            <SelectItem value="DRINK">Bebida</SelectItem>
            <SelectItem value="COMBO">Combo</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Estado</Label>
        <Select
          defaultValue={machine.status}
          onValueChange={(v: string) => setValue("status", v as MachineStatus)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ACTIVE">Activa</SelectItem>
            <SelectItem value="OUT_OF_SERVICE">Fuera de servicio</SelectItem>
            <SelectItem value="RETIRED">Retirada</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Ubicación</Label>
        <Select
          defaultValue={machine.locationId}
          onValueChange={(v: string) => setValue("locationId", v)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {clients.map((client) => (
              <SelectItem key={client.id} value={client.id}>
                {client.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button type="submit" disabled={isSubmitting}>
        Guardar cambios
      </Button>
    </form>
  );
}
