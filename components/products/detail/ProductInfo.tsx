"use client";

import { Product } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Pencil, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";
import * as Dialog from "@radix-ui/react-dialog";

interface Props {
  product: Product;
  onEdit: (product: Product) => void;
}

export function ProductInfo({ product, onEdit }: Props) {
  const router = useRouter();

  const handleDelete = async () => {
    const res = await fetch(`/api/products/${product.id}/delete`, {
      method: "POST",
    });

    if (res.ok) {
      toast({ title: "Producto eliminado correctamente" });
      router.push("/products");
      router.refresh();
    } else {
      const data = await res.json();
      toast({
        title: "No se pudo eliminar el producto",
        description: data.error ?? "Error desconocido",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-6 bg-background rounded-lg p-4 border">
      <div className="col-span-2 mt-4 flex gap-2">
        <Button size="sm" onClick={() => onEdit(product)}>
          <Pencil className="w-4 h-4 mr-2" />
          Editar
        </Button>
        <Dialog.Root>
          <Dialog.Trigger asChild>
            <Button size="sm" variant="destructive">
              <Trash className="w-4 h-4 mr-2" />
              Eliminar
            </Button>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/40 z-50" />
            <Dialog.Content className="fixed z-50 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-zinc-900 p-6 rounded-md w-[90%] max-w-md">
              <Dialog.Title className="text-lg font-medium">
                Confirmar eliminación
              </Dialog.Title>
              <Dialog.Description className="mt-2 text-sm text-muted-foreground">
                ¿Estás seguro de que quieres eliminar este producto? Esta acción no se puede deshacer.
              </Dialog.Description>
              <div className="mt-4 flex justify-end gap-2">
                <Dialog.Close asChild>
                  <Button variant="outline">Cancelar</Button>
                </Dialog.Close>
                <Dialog.Close asChild>
                  <Button variant="destructive" onClick={handleDelete}>
                    Eliminar
                  </Button>
                </Dialog.Close>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>
      <div>
        <p className="text-sm text-muted-foreground">Nombre</p>
        <p className="font-medium">{product.name}</p>
      </div>
      <div>
        <p className="text-sm text-muted-foreground">Categoría</p>
        <p>{product.category}</p>
      </div>
      <div>
        <p className="text-sm text-muted-foreground">Precio (€)</p>
        <p>{product.price.toFixed(2)}</p>
      </div>
      <div>
        <p className="text-sm text-muted-foreground">Unidad</p>
        <p>{product.unit}</p>
      </div>
      {product.cost !== null && (
        <div>
          <p className="text-sm text-muted-foreground">Coste (€)</p>
          <p>{product.cost?.toFixed(2)}</p>
        </div>
      )}
      {product.stockMin !== null && (
        <div>
          <p className="text-sm text-muted-foreground">Stock mínimo</p>
          <p>{product.stockMin}</p>
        </div>
      )}
    </div>
  );
}