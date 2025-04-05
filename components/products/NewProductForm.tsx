"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { ProductCategory } from "@prisma/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { createProduct } from "@/app/actions/createProduct";

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
  name: z.string().min(2),
  category: z.nativeEnum(ProductCategory),
  price: z.coerce.number().positive(),
  cost: z.coerce.number().optional(),
  unit: z.string().min(1),
  imageUrl: z.string().url().optional(),
  stockMin: z.coerce.number().int().nonnegative().optional(),
});

export function NewProductForm() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category: "SNACK",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setSubmitting(true);
    await createProduct(values);
    router.refresh();
    setSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label>Nombre</Label>
        <Input {...register("name")} />
        {errors.name && (
          <p className="text-xs text-red-500">{errors.name.message}</p>
        )}
      </div>

      <div>
        <Label>Categoría</Label>
        <Select
          defaultValue="SNACK"
          onValueChange={(value) =>
            setValue("category", value as ProductCategory)
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecciona categoría" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="SNACK">Snack</SelectItem>
            <SelectItem value="DRINK">Bebida</SelectItem>
            <SelectItem value="COMBO">Combo</SelectItem>
            <SelectItem value="OTHER">Otro</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Precio (€)</Label>
          <Input type="number" step="0.01" {...register("price")} />
        </div>
        <div>
          <Label>Costo (€)</Label>
          <Input type="number" step="0.01" {...register("cost")} />
        </div>
      </div>

      <div>
        <Label>Unidad (ej. lata, botella)</Label>
        <Input {...register("unit")} />
      </div>

      <div>
        <Label>URL de imagen (opcional)</Label>
        <Input {...register("imageUrl")} />
      </div>

      <div>
        <Label>Stock mínimo sugerido</Label>
        <Input type="number" {...register("stockMin")} />
      </div>

      <Button type="submit" disabled={submitting}>
        Crear producto
      </Button>
    </form>
  );
}
