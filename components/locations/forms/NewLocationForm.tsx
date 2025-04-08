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

import { Client } from "@prisma/client";
import { createLocation } from "@/app/actions/createLocation"; // 🛠️ Asegúrate de tener este action

const formSchema = z.object({
  name: z.string().min(2),
  address: z.string().min(5),
  city: z.string().min(2),
  postalCode: z.string().optional(),
  province: z.string().optional(),
  country: z.string().optional(),
  contactName: z.string().optional(),
  contactPhone: z.string().optional(),
  contactEmail: z.string().email().optional(),
  notes: z.string().optional(),
  clientId: z.string().min(1, "Selecciona un cliente"),
});

export function NewLocationForm() {
  const router = useRouter();
  const [clients, setClients] = useState<Client[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      country: "España",
    },
  });

  useEffect(() => {
    fetch("/api/clients")
      .then((res) => res.json())
      .then(setClients);
  }, []);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await createLocation(values);
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="name">Nombre</Label>
        <Input id="name" {...register("name")} />
      </div>

      <div>
        <Label htmlFor="address">Dirección</Label>
        <Input id="address" {...register("address")} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="city">Ciudad</Label>
          <Input id="city" {...register("city")} />
        </div>
        <div>
          <Label htmlFor="postalCode">Código Postal</Label>
          <Input id="postalCode" {...register("postalCode")} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="province">Provincia</Label>
          <Input id="province" {...register("province")} />
        </div>
        <div>
          <Label htmlFor="country">País</Label>
          <Input id="country" {...register("country")} />
        </div>
      </div>

      <div>
        <Label htmlFor="contactName">Nombre de contacto</Label>
        <Input id="contactName" {...register("contactName")} />
      </div>

      <div>
        <Label htmlFor="contactPhone">Teléfono</Label>
        <Input id="contactPhone" {...register("contactPhone")} />
      </div>

      <div>
        <Label htmlFor="contactEmail">Email</Label>
        <Input id="contactEmail" {...register("contactEmail")} />
      </div>

      <div>
        <Label>Cliente asociado</Label>
        <Select onValueChange={(v) => setValue("clientId", v)}>
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
          <p className="text-xs text-red-500 mt-1">{errors.clientId.message}</p>
        )}
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
