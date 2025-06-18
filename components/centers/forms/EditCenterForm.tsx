"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Center } from "@prisma/client";
import { useEffect, useState } from "react";
import { updateCenter } from "@/app/actions/updateCenter";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

const formSchema = z.object({
  id: z.string(),
  name: z.string().min(2),
  address: z.string().min(5),
  city: z.string().min(2),
  postalCode: z.string().optional(),
  province: z.string().optional(),
  country: z.string().optional(),
  contactName: z.string(),
  contactPhone: z.string(),
  contactEmail: z.string().email().optional(),
  isParent: z.boolean().optional(),
  parentCenterId: z.string().optional(),
  notes: z.string().optional(),
});

interface CenterWithIsParent extends Center {
  isParent: boolean;
}

interface Props {
  center: CenterWithIsParent;
  onSuccess?: () => void;
}

export function EditCenterForm({ center, onSuccess }: Props) {
  const router = useRouter();
  const [centers, setCenters] = useState<Center[]>([]);
  const [isParent, setIsParent] = useState(center.isParent);

  useEffect(() => {
    fetch("/api/centers?all=true")
      .then((res) => res.json())
      .then(setCenters);
  }, []);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: center.id,
      name: center.name,
      address: center.address,
      city: center.city,
      postalCode: center.postalCode ?? "",
      province: center.province ?? "",
      country: center.country ?? "España",
      contactName: center.contactName ?? "",
      contactPhone: center.contactPhone ?? "",
      contactEmail: center.contactEmail ?? "",
      isParent: center.isParent,
      parentCenterId: center.parentCenterId ?? "",
      notes: center.notes ?? "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await updateCenter({
      ...values,
      isParent,
      parentCenterId: isParent ? undefined : values.parentCenterId,
    });
    router.refresh();
    onSuccess?.(); // 👈 cierre del modal
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
        <Label htmlFor="contactPhone">Teléfono</Label>
        <Input id="contactPhone" {...register("contactPhone")} />
      </div>

      <div>
        <Label htmlFor="contactEmail">Email</Label>
        <Input id="contactEmail" {...register("contactEmail")} />
      </div>

      <div>
        <Label className="flex items-center gap-2">
          ¿Es un centro padre?
          <Switch
            checked={isParent}
            onCheckedChange={(v) => {
              setIsParent(v);
              setValue("isParent", v);
              if (v) setValue("parentCenterId", undefined);
            }}
          />
        </Label>
      </div>

      {!isParent && (
        <div>
          <Label>Centro padre</Label>
          <Select
            onValueChange={(v) => setValue("parentCenterId", v)}
            defaultValue={center.parentCenterId ?? undefined}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sin centro padre" />
            </SelectTrigger>
            <SelectContent>
              {centers.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

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
