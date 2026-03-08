"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { FiArrowRight, FiFilter, FiSearch } from "react-icons/fi";

type Product = {
  id: number;
  name: string;
  category: "Food & Beverages" | "Home & Living" | "Health & Beauty";
  price: number;
  bulkPrice: number;
  minOrder: number;
  image: string;
  discount: number;
};

const products: Product[] = [
  {
    id: 1,
    name: "Premium Rice (50kg Bag)",
    category: "Food & Beverages",
    price: 4500,
    bulkPrice: 4200,
    minOrder: 10,
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=700&q=80",
    discount: 15,
  },
  {
    id: 2,
    name: "Cooking Oil (20L Jerry Can)",
    category: "Food & Beverages",
    price: 3200,
    bulkPrice: 2950,
    minOrder: 20,
    image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=700&q=80",
    discount: 10,
  },
  {
    id: 3,
    name: "Maize Flour (90kg Bag)",
    category: "Food & Beverages",
    price: 5800,
    bulkPrice: 5400,
    minOrder: 15,
    image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=700&q=80",
    discount: 12,
  },
  {
    id: 4,
    name: "Detergent Powder (25kg)",
    category: "Home & Living",
    price: 2800,
    bulkPrice: 2500,
    minOrder: 30,
    image: "https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=700&q=80",
    discount: 20,
  },
  {
    id: 5,
    name: "Sugar (50kg Bag)",
    category: "Food & Beverages",
    price: 6500,
    bulkPrice: 6100,
    minOrder: 10,
    image: "https://images.unsplash.com/photo-1587735243574-7c28a5c525e5?w=700&q=80",
    discount: 8,
  },
  {
    id: 6,
    name: "Wheat Flour (50kg)",
    category: "Food & Beverages",
    price: 4800,
    bulkPrice: 4500,
    minOrder: 20,
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=700&q=80",
    discount: 15,
  },
  {
    id: 7,
    name: "Tissue Paper (Pack of 100)",
    category: "Home & Living",
    price: 1800,
    bulkPrice: 1600,
    minOrder: 50,
    image: "https://images.unsplash.com/photo-1584736286279-4af932d3e4d1?w=700&q=80",
    discount: 18,
  },
  {
    id: 8,
    name: "Hand Sanitizer (5L)",
    category: "Health & Beauty",
    price: 3500,
    bulkPrice: 3200,
    minOrder: 25,
    image: "https://images.unsplash.com/photo-1584483766114-2cea6facdf57?w=700&q=80",
    discount: 12,
  },
];

type CategoryFilter = "all" | Product["category"];
type SortKey = "popular" | "price-low" | "price-high";

export default function ProductsPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CategoryFilter>("all");
  const [sort, setSort] = useState<SortKey>("popular");

  const filteredProducts = useMemo(() => {
    let output = products.filter((product) => {
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
  }, [category, query, sort]);

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
                <option value="Food & Beverages">Food & Beverages</option>
                <option value="Home & Living">Home & Living</option>
                <option value="Health & Beauty">Health & Beauty</option>
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
