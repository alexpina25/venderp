"use client";

import { useForm } from "react-hook-form";
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

const formSchema = z.object({
  date: z.string(),
  operatorId: z.string(),
  notes: z.string().optional(),
});

export function NewRouteForm() {
  const router = useRouter();
  const [operators, setOperators] = useState<Operator[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: new Date().toISOString().substring(0, 10),
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

      <Button type="submit" disabled={isSubmitting}>
        Crear ruta
      </Button>
    </form>
  );
}