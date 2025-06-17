import { db } from "@/lib/db";
import { getServerAuthSession } from "@/lib/auth";
import { ProductTable } from "@/components/products/ProductTable";
import { NewProductModal } from "@/components/products/NewProductModal";

export default async function ProductsPage() {
  const session = await getServerAuthSession();
  const tenantId = session?.user?.tenant?.id;
  const products = await db.product.findMany({
    where: { tenantId },
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
