"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { updateRoute } from "@/app/actions/updateRoute";
import { RouteWithStops } from "@/types";
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
  date: z.string(),
  operatorId: z.string(),
  notes: z.string().optional(),
});

interface Props {
  route: RouteWithStops;
  onSuccess?: () => void;
}

export function EditRouteForm({ route, onSuccess }: Props) {
  const router = useRouter();
  const [operators, setOperators] = useState<{ id: string; name: string }[]>(
    []
  );

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: route.id,
      date: new Date(route.date).toISOString().substring(0, 10),
      operatorId: route.operatorId,
      notes: route.notes ?? "",
    },
  });

  useEffect(() => {
    fetch("/api/users")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setOperators(data);
      });
  }, []);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await updateRoute(values);
    router.refresh();
    onSuccess?.();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <input type="hidden" {...register("id")} />

      <div>
        <Label htmlFor="date">Fecha</Label>
        <Input id="date" type="date" {...register("date")} />
      </div>

      <div>
        <Label>Operador</Label>
        <Select
          defaultValue={route.operatorId}
          onValueChange={(v) => setValue("operatorId", v)}
        >
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

      <div className="flex justify-end gap-2">
        <Button type="submit" disabled={isSubmitting}>
          Guardar cambios
        </Button>
      </div>
    </form>
  );
}
