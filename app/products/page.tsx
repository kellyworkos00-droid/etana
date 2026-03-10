"use client";

import Image from "next/image";
import Link from "next/link";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { FiArrowRight, FiFilter, FiSearch } from "react-icons/fi";
import { products, type Product } from "@/lib/products";
import { fetchProductsFromApi, LIVE_REFRESH_INTERVAL_MS } from "@/lib/store-api";

type CategoryFilter = "all" | Product["category"];
type SortKey = "popular" | "price-low" | "price-high";

function ProductsPageContent() {
  const searchParams = useSearchParams();
  const [catalog, setCatalog] = useState<Product[]>(products);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CategoryFilter>("all");
  const [sort, setSort] = useState<SortKey>("popular");

  const availableCategories = useMemo(
    () => Array.from(new Set(catalog.map((product) => product.category))),
    [catalog]
  );

  useEffect(() => {
    const categoryFromQuery = searchParams.get("category");
    if (!categoryFromQuery) {
      return;
    }

    const match = availableCategories.find((item) => item === categoryFromQuery);
    if (match) {
      setCategory(match);
    }
  }, [availableCategories, searchParams]);

  useEffect(() => {
    let mounted = true;

    const syncProducts = async () => {
      const data = await fetchProductsFromApi();
      if (mounted) {
        setCatalog(data);
      }
    };

    syncProducts();
    const interval = window.setInterval(syncProducts, LIVE_REFRESH_INTERVAL_MS);

    const onVisible = () => {
      if (document.visibilityState === "visible") {
        syncProducts();
      }
    };

    document.addEventListener("visibilitychange", onVisible);

    return () => {
      mounted = false;
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);

  const filteredProducts = useMemo(() => {
    let output = catalog.filter((product) => {
      const categoryMatch = category === "all" || product.category === category;
      const queryMatch = product.name.toLowerCase().includes(query.toLowerCase());
      return categoryMatch && queryMatch;
    });

    if (sort === "price-low") {
      output = [...output].sort((a, b) => a.bulkPrice - b.bulkPrice);
    }

    if (sort === "price-high") {
      output = [...output].sort((a, b) => b.bulkPrice - a.bulkPrice);
    }

    if (sort === "popular") {
      output = [...output].sort((a, b) => b.discount - a.discount);
    }

    return output;
  }, [catalog, category, query, sort]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-rose-50/35 px-4 pb-24 pt-28 md:pb-10">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8">
          <h1 className="font-display text-4xl text-gray-900 md:text-5xl">All Products</h1>
          <p className="mt-2 max-w-2xl text-gray-600">Browse our wholesale-ready catalog with compact cards for faster comparison.</p>
        </header>

        <section className="mb-6 rounded-2xl border border-rose-100 bg-white p-4 shadow-sm md:p-5">
          <div className="grid gap-3 md:grid-cols-[1.5fr_1fr_1fr]">
            <label className="relative text-sm text-gray-700">
              <FiSearch className="pointer-events-none absolute left-3 top-[38px] text-gray-400" />
              Search product
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Rice, sanitizer, detergent..."
                className="mt-1 w-full rounded-lg border border-gray-300 py-2.5 pl-9 pr-3 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
              />
            </label>

            <label className="text-sm text-gray-700">
              Category
              <select
                value={category}
                onChange={(event) => setCategory(event.target.value as CategoryFilter)}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
              >
                <option value="all">All categories</option>
                {availableCategories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>

            <label className="text-sm text-gray-700">
              Sort by
              <select
                value={sort}
                onChange={(event) => setSort(event.target.value as SortKey)}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
              >
                <option value="popular">Most popular</option>
                <option value="price-low">Price: low to high</option>
                <option value="price-high">Price: high to low</option>
              </select>
            </label>
          </div>

          <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-primary-700">
            <FiFilter /> Showing {filteredProducts.length} products
          </p>
        </section>

        <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {filteredProducts.map((product) => (
            <article
              key={product.id}
              className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              <div className="relative h-36 overflow-hidden bg-gray-100">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute left-2 top-2 rounded-full bg-primary-600 px-2 py-0.5 text-[10px] font-bold text-white">
                  -{product.discount}%
                </span>
              </div>

              <div className="p-3">
                <p className="mb-1 line-clamp-1 text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                  {product.category}
                </p>
                <h2 className="mb-2 line-clamp-2 text-sm font-semibold text-gray-900">{product.name}</h2>

                <div className="mb-2 flex items-baseline gap-1.5">
                  <span className="text-sm font-bold text-primary-700">KES {product.bulkPrice.toLocaleString()}</span>
                  <span className="text-[11px] text-gray-500 line-through">KES {product.price.toLocaleString()}</span>
                </div>

                <p className="mb-3 text-[11px] text-gray-500">Min: {product.minOrder} units</p>

                <Link
                  href={`/products/${product.id}`}
                  className="inline-flex w-full items-center justify-center gap-1 rounded-md border border-gray-300 px-2 py-1.5 text-xs font-semibold text-gray-700 transition hover:border-primary-500 hover:text-primary-700"
                >
                  View Product <FiArrowRight className="text-xs" />
                </Link>
              </div>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-white px-4 pb-24 pt-28 md:pb-10" />}>
      <ProductsPageContent />
    </Suspense>
  );
}
