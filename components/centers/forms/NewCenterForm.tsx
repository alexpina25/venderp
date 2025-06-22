"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import { Center } from "@prisma/client";
import { createCenter } from "@/app/actions/createCenter";
import { toast } from "@/components/ui/use-toast";

const formSchema = z
  .object({
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
    isParent: z.boolean().optional(),
    parentCenterId: z.string().optional(),
  })
  .refine((data) => data.isParent || !!data.parentCenterId, {
    message: "Centro padre requerido",
    path: ["parentCenterId"],
  });

export function NewCenterForm() {
  const router = useRouter();
  const { data: session } = useSession() as {
    data: { user?: { tenant?: { id: string } } };
  };

  const [centers, setCenters] = useState<Center[]>([]);
  const [isParent, setIsParent] = useState(true);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      country: "España",
      isParent: true,
    },
  });

  useEffect(() => {
    fetch("/api/centers?all=true")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setCenters(data);
      });
  }, []);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const tenantId = session?.user?.tenant?.id;

    if (!tenantId) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se encontró tenant ID",
      });
      return;
    }

    try {
      await createCenter({
        ...values,
        tenantId: tenantId,
        parentCenterId: isParent ? undefined : values.parentCenterId,
      });
      toast({
        title: "Centro creado",
        description: "El centro se ha registrado correctamente.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error al crear centro",
        description: "No se pudo crear el centro.",
      });
    }

    router.refresh();
    router.push("/centers");
  };

  const parentCenters = centers.filter((c) => c.parentCenterId === null);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 bg-background p-6 rounded-lg border mx-auto"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Nombre</Label>
          <Input
            id="name"
            placeholder="Nombre del centro"
            {...register("name")}
          />
          {errors.name && (
            <p className="text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>
        <div>
          <Label htmlFor="address">Dirección</Label>
          <Input
            id="address"
            placeholder="Calle y número"
            {...register("address")}
          />
          {errors.address && (
            <p className="text-sm text-red-500">{errors.address.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="city">Ciudad</Label>
          <Input id="city" {...register("city")} />
          {errors.city && (
            <p className="text-sm text-red-500">{errors.city.message}</p>
          )}
        </div>
        <div>
          <Label htmlFor="postalCode">Código Postal</Label>
          <Input id="postalCode" {...register("postalCode")} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="province">Provincia</Label>
          <Input id="province" {...register("province")} />
        </div>
        <div>
          <Label htmlFor="country">País</Label>
          <Input id="country" {...register("country")} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="contactName">Nombre de contacto</Label>
          <Input id="contactName" {...register("contactName")} />
        </div>
        <div>
          <Label htmlFor="contactPhone">Teléfono</Label>
          <Input id="contactPhone" {...register("contactPhone")} />
        </div>
      </div>

      <div>
        <Label htmlFor="contactEmail">Email</Label>
        <Input id="contactEmail" {...register("contactEmail")} />
        {errors.contactEmail && (
          <p className="text-sm text-red-500">{errors.contactEmail.message}</p>
        )}
      </div>

      <div>
        <Label className="flex items-center gap-2">
          ¿Es un centro padre?
          <Switch
            checked={isParent}
            onCheckedChange={(v) => {
              setIsParent(v);
              setValue("isParent", v);
              if (v) setValue("parentCenterId", undefined); // limpio selección si se marca como padre
            }}
          />
        </Label>
      </div>

      {!isParent && (
        <div>
          <Label>Centro padre</Label>
          <Select onValueChange={(v) => setValue("parentCenterId", v)}>
            <SelectTrigger>
              <SelectValue placeholder="Selecciona centro padre" />
            </SelectTrigger>
            <SelectContent>
              {parentCenters
                .filter((c) => c.id)
                .map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
          {errors.parentCenterId && (
            <p className="text-sm text-red-500 mt-1">
              {errors.parentCenterId.message}
            </p>
          )}
        </div>
      )}

      <div>
        <Label htmlFor="notes">Notas</Label>
        <Textarea
          id="notes"
          {...register("notes")}
          placeholder="Observaciones adicionales"
        />
      </div>
      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-green-600 hover:bg-green-700"
      >
        Crear centro
      </Button>
    </form>
  );
}
