"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";
import { fetchProductsFromApi } from "@/lib/store-api";

type PromoBanner = {
  id: string;
  name: string;
  category: string;
  image: string;
  price: number;
  discount: number;
  cta: string;
  badgeText?: string;
};

export default function FeaturedPromoGrid() {
  const [products, setProducts] = useState<PromoBanner[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const allProducts = (await fetchProductsFromApi())
          .sort((a, b) => {
            if (b.discount !== a.discount) {
              return b.discount - a.discount;
            }
            return b.price - a.price;
          })
          .slice(0, 4)
          .map((p) => ({
            id: p.id,
            name: p.name,
            category: p.category,
            image: p.image,
            price: p.price,
            discount: p.discount || 0,
            cta: "Shop Now",
            badgeText: p.discount > 0 ? `${p.discount}% OFF` : undefined,
          }));
        setProducts(allProducts);
      } catch (error) {
        setProducts([]);
      }
    };

    fetchProducts();
  }, []);

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Featured Deals</h2>
        <p className="mt-2 text-gray-600">Handpicked offers just for you</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((promo) => (
          <Link
            key={promo.id}
            href={`/products`}
            className="group relative overflow-hidden rounded-2xl border border-rose-100 bg-white transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="relative h-40 w-full overflow-hidden bg-gray-100 sm:h-44">
              <Image
                src={promo.image}
                alt={promo.name}
                fill
                className="object-cover transition group-hover:scale-110"
              />

              {promo.badgeText && (
                <div className="absolute right-2 top-2 rounded-full bg-rose-600 px-2 py-1 text-xs font-bold text-white shadow-lg">
                  {promo.badgeText}
                </div>
              )}
            </div>

            <div className="p-4 sm:p-5">
              <p className="text-xs font-semibold text-primary-600">{promo.category}</p>
              <h3 className="mt-2 line-clamp-2 font-bold text-gray-900">{promo.name}</h3>

              <div className="mt-3 flex items-end justify-between">
                <div>
                  <p className="text-xl font-bold text-rose-600">KSh {Math.round(promo.price).toLocaleString()}</p>
                  {promo.discount > 0 && (
                    <p className="text-xs text-gray-500 line-through">
                      KSh {Math.round(promo.price * (1 + promo.discount / 100)).toLocaleString()}
                    </p>
                  )}
                </div>
              </div>

              <button className="mt-4 w-full rounded-lg bg-gradient-to-r from-rose-500 to-rose-600 py-2.5 text-sm font-semibold text-white transition hover:shadow-lg">
                {promo.cta}
              </button>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
