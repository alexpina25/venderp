"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { createRoute } from "@/app/actions/createRoute";
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

type Operator = { id: string; name: string };
type PosBasic = { id: string; name: string };

const stopSchema = z.object({
  posId: z.string(),
  cashCollected: z.coerce.number().optional(),
  walletReload: z.coerce.number().optional(),
  maintenanceNotes: z.string().optional(),
  priceChangeNotes: z.string().optional(),
  notes: z.string().optional(),
});

const formSchema = z.object({
  date: z.string(),
  operatorId: z.string(),
  notes: z.string().optional(),
    stops: z.array(stopSchema),
});

export function NewRouteForm() {
  const router = useRouter();
  const [operators, setOperators] = useState<Operator[]>([]);
    const [posList, setPosList] = useState<PosBasic[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
        control,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: new Date().toISOString().substring(0, 10),
            stops: [],
    },
  });

    const { fields, append, remove } = useFieldArray({ control, name: "stops" });

  useEffect(() => {
    fetch("/api/users")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setOperators(data);
      });
  }, []);

    useEffect(() => {
    fetch("/api/pos")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data))
          setPosList(data.map((p: any) => ({ id: p.id, name: p.name })));
      });
  }, []);

  const togglePos = (pos: PosBasic) => {
    const index = fields.findIndex((f) => f.posId === pos.id);
    if (index >= 0) {
      remove(index);
    } else {
      append({ posId: pos.id });
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await createRoute(values);
    router.refresh();
    router.push("/routes");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="date">Fecha</Label>
        <Input id="date" type="date" {...register("date")} />
      </div>

      <div>
        <Label>Operador</Label>
        <Select onValueChange={(v) => setValue("operatorId", v)}>
          <SelectTrigger>
            <SelectValue placeholder="Selecciona operador" />
          </SelectTrigger>
          <SelectContent>
            {operators.map((op) => (
              <SelectItem key={op.id} value={op.id}>
                {op.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.operatorId && (
          <p className="text-xs text-red-500">{errors.operatorId.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="notes">Notas</Label>
        <Input id="notes" {...register("notes")} />
      </div>

      <div>
        <Label>Puntos de venta</Label>
        <div className="space-y-2">
          {posList.map((pos) => {
            const selected = fields.findIndex((f) => f.posId === pos.id) >= 0;
            return (
              <div key={pos.id} className="border p-2 rounded-md">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selected}
                    onChange={() => togglePos(pos)}
                  />
                  {pos.name}
                </label>
                {selected && (
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <Input
                      placeholder="Efectivo"
                      type="number"
                      {...register(
                        `stops.${fields.findIndex((f) => f.posId === pos.id)}.cashCollected` as const,
                        { valueAsNumber: true }
                      )}
                    />
                    <Input
                      placeholder="Recarga wallet"
                      type="number"
                      {...register(
                        `stops.${fields.findIndex((f) => f.posId === pos.id)}.walletReload` as const,
                        { valueAsNumber: true }
                      )}
                    />
                    <Input
                      placeholder="Notas mantenimiento"
                      {...register(
                        `stops.${fields.findIndex((f) => f.posId === pos.id)}.maintenanceNotes` as const
                      )}
                    />
                    <Input
                      placeholder="Notas precios"
                      {...register(
                        `stops.${fields.findIndex((f) => f.posId === pos.id)}.priceChangeNotes` as const
                      )}
                    />
                    <Input
                      placeholder="Notas generales"
                      {...register(
                        `stops.${fields.findIndex((f) => f.posId === pos.id)}.notes` as const
                      )}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      
      <Button type="submit" disabled={isSubmitting}>
        Crear ruta
      </Button>
    </form>
  );
}
