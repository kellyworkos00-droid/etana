import Image from "next/image";
import Link from "next/link";
import { FiArrowRight, FiGrid, FiLayers } from "react-icons/fi";

const categoryItems = [
  {
    name: "Food & Beverages",
    count: 150,
    description: "Bulk grains, cooking essentials, and packaged goods.",
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&q=80",
    href: "/categories/food-beverages",
  },
  {
    name: "Home & Living",
    count: 200,
    description: "Cleaning, tissue, and daily home supply products.",
    image: "https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=1200&q=80",
    href: "/categories/home-living",
  },
  {
    name: "Electronics",
    count: 120,
    description: "Reliable accessories and utility electronic products.",
    image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=1200&q=80",
    href: "/categories/electronics",
  },
  {
    name: "Tools & Hardware",
    count: 180,
    description: "Business maintenance and workshop essentials.",
    image: "https://images.unsplash.com/photo-1581147036324-c1c7d39a3a2d?w=1200&q=80",
    href: "/categories/tools-hardware",
  },
  {
    name: "Fashion & Apparel",
    count: 250,
    description: "Textiles, apparel stock, and packaging-ready lines.",
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=1200&q=80",
    href: "/categories/fashion",
  },
  {
    name: "Health & Beauty",
    count: 90,
    description: "Sanitizers, personal care, and hygiene inventory.",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1200&q=80",
    href: "/categories/health-beauty",
  },
];

export default function CategoriesPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-rose-50/35 px-4 pb-24 pt-28 md:pb-10">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 text-center md:text-left">
          <h1 className="font-display text-4xl text-gray-900 md:text-5xl">Categories</h1>
          <p className="mt-2 max-w-2xl text-gray-600">
            Explore our wholesale catalog by category and quickly jump into product groups that match your business needs.
          </p>
        </header>

        <section className="mb-7 grid gap-3 rounded-2xl border border-rose-100 bg-white p-4 shadow-sm md:grid-cols-3">
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
            <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-primary-700">
              <FiGrid /> Total Categories
            </p>
            <p className="mt-2 text-2xl font-bold text-gray-900">{categoryItems.length}</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
            <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-primary-700">
              <FiLayers /> Product Lines
            </p>
            <p className="mt-2 text-2xl font-bold text-gray-900">990+</p>
          </div>
          <Link
            href="/products"
            className="rounded-xl border border-primary-200 bg-primary-50 p-4 text-primary-700 transition hover:bg-primary-100"
          >
            <p className="text-xs font-semibold uppercase tracking-wide">Quick Action</p>
            <p className="mt-2 inline-flex items-center gap-2 text-base font-bold">
              View All Products <FiArrowRight />
            </p>
          </Link>
        </section>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categoryItems.map((category) => (
            <article
              key={category.name}
              className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="relative h-40">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-transparent" />
                <span className="absolute right-3 top-3 rounded-full bg-white/90 px-2 py-1 text-xs font-semibold text-gray-800">
                  {category.count} items
                </span>
              </div>

              <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-900">{category.name}</h2>
                <p className="mt-1 text-sm text-gray-600">{category.description}</p>
                <Link
                  href={category.href}
                  className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary-700 transition hover:text-primary-800"
                >
                  Explore Category <FiArrowRight />
                </Link>
              </div>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
