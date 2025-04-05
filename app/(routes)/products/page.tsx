import { db } from "@/lib/db";
import { ProductTable } from "@/components/products/ProductTable";
import { NewProductModal } from "@/components/products/NewProductModal";

export default async function ProductsPage() {
  const products = await db.product.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-6 space-y-6 bg-background">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Productos</h2>
        <NewProductModal />
      </div>

      <ProductTable data={products} />
    </div>
  );
}
