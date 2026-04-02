"use client";

import { Suspense } from "react";
import { ProductsList } from "@/app/components/ProductsList";
import { useSearchParams } from "next/navigation";

function ProductsContent() {
  const searchParams = useSearchParams();
  const category = searchParams.get("category") || undefined;
  const search = searchParams.get("search") || undefined;
  const seller = searchParams.get("seller") || undefined;

  return (
    <ProductsList
      category={category}
      search={search}
      sellerId={seller}
    />
  );
}

export default function ProductsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold">Marketplace</h1>
        <p className="text-gray-600 mt-2">
          Discover quality products from verified sellers across Kenya
        </p>
      </div>

      <Suspense fallback={<div className="py-12 text-center text-gray-400">Loading products…</div>}>
        <ProductsContent />
      </Suspense>
    </div>
  );
}
