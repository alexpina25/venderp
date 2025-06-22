"use client"; // Esto marca este archivo como un componente de cliente

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { POS, Machine, MachineStatus, MachineType } from "@prisma/client";
import { updateMachine } from "@/app/actions/updateMachine";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";

const formSchema = z.object({
  id: z.string(),
  model: z.string().optional(),
  serialNumber: z.string().optional(),
  type: z.nativeEnum(MachineType),
  status: z.nativeEnum(MachineStatus),
  posId: z.string().optional(),
  installedAt: z.string().optional(),
});

interface Props {
  machine: Machine & { pos: { name: string } | null };
  open: boolean;
  onClose: () => void; // Función para cerrar el modal
  onSuccess: () => void; // Callback for successful edit
}

export function EditMachineModal({ machine, open, onClose, onSuccess }: Props) {
  const [posList, setPosList] = useState<POS[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: machine.id,
      model: machine.model ?? "",
      serialNumber: machine.serialNumber ?? "",
      type: machine.type,
      status: machine.status,
      posId: machine.posId ?? "",
      installedAt: machine.installedAt
        ? new Date(machine.installedAt).toISOString().split("T")[0]
        : "",
    },
  });

  useEffect(() => {
    fetch("/api/pos")
      .then((res) => res.json())
      .then(setPosList);
  }, []);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await updateMachine(values);
    onSuccess(); // Actualiza los datos en el componente principal y cierra el modal
    onClose(); // Cierra el modal después de guardar los cambios
  };

  const handleCancel = () => {
    // Cuando se hace clic en cancelar, simplemente cerramos el modal
    onClose(); // Esto debería restablecer el estado o hacer un refetch si es necesario
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Editar máquina</DialogTitle>
        </DialogHeader>

        {/* Formulario de edición */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input type="hidden" {...register("id")} />


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
              defaultValue={machine.type}
              onValueChange={(v) => setValue("type", v as MachineType)}
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
              defaultValue={machine.status}
              onValueChange={(v) => setValue("status", v as MachineStatus)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ACTIVE">Activa</SelectItem>
                <SelectItem value="OUT_OF_SERVICE">
                  Fuera de servicio
                </SelectItem>
                <SelectItem value="RETIRED">Retirada</SelectItem>
                <SelectItem value="NOT_INSTALLED">Sin instalar</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
          <Label htmlFor="posId">PDV</Label>
          <Select
              defaultValue={machine.posId ?? undefined}
              onValueChange={(v) => setValue("posId", v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona PDV" />
              </SelectTrigger>
              <SelectContent>
                {posList.map((pos) => (
                  <SelectItem key={pos.id} value={pos.id}>
                    {pos.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="installedAt">Fecha de instalación</Label>
            <Input id="installedAt" type="date" {...register("installedAt")} />
          </div>

          <div className="mt-4 flex justify-end space-x-2">
            {/* Botón de Cancelar */}
            <Button variant="outline" onClick={handleCancel}>
              Cancelar
            </Button>
            {/* Botón de Guardar */}
            <Button variant="default" type="submit" disabled={isSubmitting}>
              Guardar cambios
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
