"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { Product, ProductCategory } from "@prisma/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

import { updateProduct } from "@/app/actions/updateProduct";
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
  name: z.string().min(2),
  category: z.nativeEnum(ProductCategory),
  price: z.coerce.number().positive(),
  cost: z.coerce.number().optional(),
  unit: z.string().min(1),
  imageUrl: z.string().url().optional(),
  stockMin: z.coerce.number().int().nonnegative().optional(),
});

interface EditProductFormProps {
  product: Product;
  onSuccess?: () => void;
}

export function EditProductForm({ product, onSuccess }: EditProductFormProps) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: product.id,
      name: product.name,
      category: product.category,
      price: product.price,
      cost: product.cost ?? undefined,
      unit: product.unit,
      imageUrl: product.imageUrl ?? "",
      stockMin: product.stockMin ?? undefined,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await updateProduct(values);
    router.refresh();
    onSuccess?.();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <input type="hidden" {...register("id")} />

      <div>
        <Label>Nombre</Label>
        <Input {...register("name")} />
      </div>

      <div>
        <Label>Categoría</Label>
        <Select
          defaultValue={product.category}
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
        <Label>Unidad</Label>
        <Input {...register("unit")} />
      </div>

      <div>
        <Label>URL de imagen</Label>
        <Input {...register("imageUrl")} />
      </div>

      <div>
        <Label>Stock mínimo</Label>
        <Input type="number" {...register("stockMin")} />
      </div>

      <Button type="submit" disabled={isSubmitting}>
        Guardar cambios
      </Button>
    </form>
  );
}
