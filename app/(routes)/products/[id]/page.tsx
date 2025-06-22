"use client";

import { useState, useEffect } from "react";
import { Product } from "@prisma/client";
import { ProductInfo } from "@/components/products/detail/ProductInfo";
import { EditProductModal } from "@/components/products/EditProductModal";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

async function fetchProductData(id: string): Promise<Product> {
  const res = await fetch(`/api/products/${id}`);
  if (!res.ok) {
    throw new Error("Error fetching product data");
  }
  return res.json();
}

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  useEffect(() => {
    fetchProductData(params.id)
      .then(setProduct)
      .catch((err) => console.error(err));
  }, [params.id]);

  const refresh = async () => {
    const updated = await fetchProductData(params.id);
    setProduct(updated);
  };

  return (
    <div className="p-6 space-y-8">
      <div className="flex items-center gap-2">
        <Button asChild variant="default" size="icon">
          <Link href="/products">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h2 className="text-2xl font-bold">Detalle de producto</h2>
      </div>
      {product && (
        <>
          <EditProductModal
            product={product}
            open={isEditOpen}
            onClose={() => setIsEditOpen(false)}
            onSuccess={async () => {
              await refresh();
              setIsEditOpen(false);
            }}
          />
          <ProductInfo product={product} onEdit={() => setIsEditOpen(true)} />
        </>
      )}
    </div>
  );
}