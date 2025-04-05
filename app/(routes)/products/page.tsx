// app/(routes)/products/page.tsx
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

export default async function ProductsPage() {
  const products = await db.product.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Productos</h2>
        <Button asChild>
          <Link href="/products/new">+ Nuevo producto</Link>
        </Button>
      </div>

      <div className="border rounded-lg p-4 bg-background shadow">
        {products.length === 0 ? (
          <p className="text-muted-foreground">
            No hay productos registrados aún.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <div
                key={product.id}
                className="flex items-center gap-4 border rounded-md p-4"
              >
                {product.imageUrl ? (
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    width={48}
                    height={48}
                    className="rounded-md object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 bg-muted rounded-md flex items-center justify-center text-sm">
                    {product.name[0]}
                  </div>
                )}

                <div className="flex-1">
                  <p className="font-medium">{product.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {product.category} · {product.unit} ·{" "}
                    {product.price.toFixed(2)}€
                  </p>
                  {product.stockMin && (
                    <p className="text-xs text-yellow-700">
                      Stock mínimo: {product.stockMin}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
