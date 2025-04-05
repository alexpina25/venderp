"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import { createClient } from "@/app/actions/createClient";

const formSchema = z.object({
  name: z.string().min(2),
  address: z.string().min(5),
  city: z.string().min(2),
  postalCode: z.string().optional(),
  province: z.string().optional(),
  country: z.string().optional(),
  contactName: z.string(),
  contactPhone: z.string(),
  contactEmail: z.string().email().optional(),
  notes: z.string().optional(),
});

export function NewClientForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      country: "España",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await createClient(values);
    router.refresh(); // recarga los datos en /clients
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="name">Nombre del cliente / ubicación</Label>
        <Input id="name" {...register("name")} />
        {errors.name && (
          <p className="text-xs text-red-500">{errors.name.message}</p>
        )}
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
          <Label htmlFor="postalCode">Código postal</Label>
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
        <Label htmlFor="contactPhone">Teléfono de contacto</Label>
        <Input id="contactPhone" {...register("contactPhone")} />
      </div>

      <div>
        <Label htmlFor="contactEmail">Email de contacto</Label>
        <Input id="contactEmail" {...register("contactEmail")} />
      </div>

      <div>
        <Label htmlFor="notes">Notas</Label>
        <Input id="notes" {...register("notes")} />
      </div>

      <Button type="submit" disabled={isSubmitting}>
        Guardar cliente
      </Button>
    </form>
  );
}
