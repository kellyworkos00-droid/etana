"use client";

import Image from "next/image";
import Link from "next/link";

interface ProductCardProps {
  product: {
    id: string;
    slug: string;
    name: string;
    imageUrl: string;
    price: number;
    bulkPrice: number;
    minOrder: number;
    stockQty: number;
    discountPct: number;
    seller: {
      id: string;
      businessName: string;
      logo?: string;
      rating: number;
    };
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const discountedPrice = product.price * (1 - product.discountPct / 100);
  const inStock = product.stockQty > 0;

  return (
    <Link href={`/products/${product.slug}`}>
      <div className="bg-white rounded-lg border hover:border-blue-400 transition overflow-hidden hover:shadow-lg cursor-pointer h-full">
        {/* Image */}
        <div className="relative w-full h-40 bg-gray-100 overflow-hidden">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover"
            onError={(e) => {
              e.currentTarget.src = "/placeholder-product.jpg";
            }}
          />
          {!inStock && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span className="bg-red-600 text-white px-3 py-1 rounded font-semibold">
                Out of Stock
              </span>
            </div>
          )}
          {product.discountPct > 0 && (
            <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
              -{product.discountPct}%
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 space-y-2">
          {/* Seller Badge */}
          <div className="flex items-center gap-2 text-xs">
            {product.seller.logo && (
              <img
                src={product.seller.logo}
                alt={product.seller.businessName}
                className="w-5 h-5 rounded-full"
              />
            )}
            <div>
              <p className="font-medium text-gray-700 line-clamp-1">
                {product.seller.businessName}
              </p>
              {product.seller.rating > 0 && (
                <p className="text-yellow-500">⭐ {product.seller.rating}/5</p>
              )}
            </div>
          </div>

          {/* Product Name */}
          <h3 className="font-semibold text-sm line-clamp-2">{product.name}</h3>

          {/* Pricing */}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-blue-600">
                KES {discountedPrice.toLocaleString(undefined, {
                  maximumFractionDigits: 0,
                })}
              </span>
              {product.discountPct > 0 && (
                <span className="text-xs text-gray-500 line-through">
                  KES {product.price.toLocaleString(undefined, {
                    maximumFractionDigits: 0,
                  })}
                </span>
              )}
            </div>
            {product.bulkPrice < product.price && (
              <p className="text-xs text-gray-600">
                Bulk: KES{" "}
                {product.bulkPrice.toLocaleString(undefined, {
                  maximumFractionDigits: 0,
                })}
              </p>
            )}
          </div>

          {/* Min Order */}
          <p className="text-xs text-gray-500">
            Min: {product.minOrder} unit{product.minOrder !== 1 ? "s" : ""}
          </p>

          {/* Status */}
          <div
            className={`text-xs font-semibold rounded px-2 py-1 ${
              inStock
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {inStock ? `${product.stockQty} in stock` : "Out of stock"}
          </div>
        </div>
      </div>
    </Link>
  );
}
