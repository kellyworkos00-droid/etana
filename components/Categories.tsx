import Link from "next/link";
import Image from "next/image";
import {
  FiBox,
  FiHome,
  FiTool,
  FiShoppingBag,
  FiCoffee,
  FiHeart,
  FiArrowRight,
} from "react-icons/fi";

const categories = [
  {
    id: 1,
    name: "Groceries",
    icon: FiCoffee,
    count: 150,
    color: "bg-orange-500",
    image:
      "https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&q=80",
    size: "",
    link: "/products?category=Groceries",
  },
  {
    id: 2,
    name: "Home & Living",
    icon: FiHome,
    count: 200,
    color: "bg-blue-500",
    image:
      "https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=1200&q=80",
    size: "",
    link: "/products?category=Home%20%26%20Living",
  },
  {
    id: 3,
    name: "Electronics",
    icon: FiBox,
    count: 120,
    color: "bg-purple-500",
    image:
      "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=1200&q=80",
    size: "",
    link: "/products?category=Electronics",
  },
  {
    id: 4,
    name: "Tools & Hardware",
    icon: FiTool,
    count: 180,
    color: "bg-red-500",
    image:
      "https://images.unsplash.com/photo-1581147036324-c1c7d39a3a2d?w=1200&q=80",
    size: "",
    link: "/products?category=Tools%20%26%20Hardware",
  },
  {
    id: 5,
    name: "Fashion & Apparel",
    icon: FiShoppingBag,
    count: 250,
    color: "bg-pink-500",
    image:
      "https://images.unsplash.com/photo-1445205170230-053b83016050?w=1200&q=80",
    size: "",
    link: "/products?category=Fashion%20%26%20Apparel",
  },
  {
    id: 6,
    name: "Health & Beauty",
    icon: FiHeart,
    count: 90,
    color: "bg-green-500",
    image:
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1200&q=80",
    size: "",
    link: "/products?category=Health%20%26%20Beauty",
  },
];

export default function Categories() {
  return (
    <section className="relative overflow-hidden py-20 bg-[radial-gradient(circle_at_top_right,_rgba(225,29,72,0.1),_transparent_40%),linear-gradient(to_bottom,#ffffff,#fff1f2)]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-20 right-10 h-52 w-52 rounded-full bg-rose-200/30 blur-3xl" />
        <div className="absolute bottom-0 -left-14 h-52 w-52 rounded-full bg-orange-200/30 blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Browse by Category
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Explore product zones built for wholesale buyers. Each category is tuned for
            recurring procurement and fast re-ordering.
          </p>
        </div>

        <div className="grid auto-rows-[180px] grid-cols-2 gap-3 sm:auto-rows-[190px] sm:grid-cols-3 lg:grid-cols-6">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Link
                key={category.id}
                href={category.link}
                className={`group relative overflow-hidden rounded-2xl border border-white/40 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${category.size}`}
              >
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent transition-all duration-500 group-hover:from-black/80" />

                <div className="absolute inset-0 flex flex-col justify-between p-3.5">
                  <div className="flex items-start justify-between">
                    <div
                      className={`${category.color} inline-flex h-9 w-9 items-center justify-center rounded-xl shadow-lg transition-transform duration-300 group-hover:scale-105 group-hover:rotate-3`}
                    >
                      <Icon className="text-base text-white" />
                    </div>
                    <span className="rounded-full bg-white/90 px-2.5 py-0.5 text-[11px] font-semibold text-gray-800">
                      {category.count} items
                    </span>
                  </div>

                  <div>
                    <h3 className="mb-1 text-base font-bold tracking-tight text-white text-balance sm:text-lg">
                      {category.name}
                    </h3>

                    <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-0.5 text-xs font-semibold text-white backdrop-blur-sm transition group-hover:bg-primary-600">
                      Explore <FiArrowRight className="transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
