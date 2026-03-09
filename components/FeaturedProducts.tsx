"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  FiShoppingCart,
  FiEye,
  FiArrowRight,
  FiPackage,
  FiTrendingUp,
  FiFilter,
  FiChevronLeft,
  FiChevronRight,
  FiAward,
  FiCheckCircle,
} from "react-icons/fi";
import { products, type Product } from "@/lib/products";
import { fetchProductsFromApi, LIVE_REFRESH_INTERVAL_MS } from "@/lib/store-api";
import { addItemToCart } from "@/lib/cart";

type FilterKey = "all" | "food" | "home" | "health";

export default function FeaturedProducts() {
  const [catalog, setCatalog] = useState<Product[]>(products);
  const [activeTab, setActiveTab] = useState<FilterKey>("all");
  const [addedProductId, setAddedProductId] = useState<string | null>(null);
  const carouselRef = useRef<HTMLDivElement | null>(null);

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

  const filters: { key: FilterKey; label: string; helper: string }[] = [
    { key: "all", label: "All Products", helper: "Full catalog" },
    { key: "food", label: "Groceries", helper: "Best sellers" },
    { key: "home", label: "Home & Living", helper: "Business essentials" },
    { key: "health", label: "Health & Beauty", helper: "Hygiene must-haves" },
  ];

  const filteredProducts = useMemo(() => {
    if (activeTab === "all") {
      return catalog;
    }

    const categoryByFilter: Record<Exclude<FilterKey, "all">, Product["category"]> = {
      food: "Groceries",
      home: "Home & Living",
      health: "Health & Beauty",
    };

    return catalog.filter((product) => product.category === categoryByFilter[activeTab]);
  }, [activeTab, catalog]);

  const totalSavings = useMemo(
    () =>
      filteredProducts.reduce((accumulator, product) => {
        const savePerUnit = product.price - product.bulkPrice;
        return accumulator + savePerUnit * product.minOrder;
      }, 0),
    [filteredProducts]
  );

  const bestSellerIds = useMemo(() => {
    return [...catalog]
      .sort((a, b) => b.discount - a.discount)
      .slice(0, 3)
      .map((product) => product.id);
  }, [catalog]);

  const scrollProducts = (direction: "left" | "right") => {
    if (!carouselRef.current) {
      return;
    }

    const scrollAmount = Math.round(carouselRef.current.clientWidth * 0.82);
    carouselRef.current.scrollBy({
      left: direction === "right" ? scrollAmount : -scrollAmount,
      behavior: "smooth",
    });
  };

  const handleAddToCart = (product: Product) => {
    addItemToCart({
      id: product.id,
      name: product.name,
      image: product.image,
      price: product.bulkPrice,
      quantity: Math.max(1, product.minOrder),
      minOrder: product.minOrder,
    });

    setAddedProductId(product.id);
    window.setTimeout(() => setAddedProductId((current) => (current === product.id ? null : current)), 1100);
  };

  return (
    <section className="relative overflow-hidden py-20 bg-gradient-to-b from-white to-rose-50/40">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-20 -left-16 h-56 w-56 rounded-full bg-rose-200/35 blur-3xl" />
        <div className="absolute -bottom-24 -right-10 h-64 w-64 rounded-full bg-orange-200/30 blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-1.5 text-sm font-semibold text-gray-700 shadow-sm mb-5">
            <FiTrendingUp className="text-primary-600" />
            High-Demand Picks
          </span>

          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Featured Products
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8 leading-relaxed">
            Bulk-ready products chosen by high-volume buyers. Pricing reflects wholesale rates,
            built for faster margins.
          </p>

          <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm text-gray-600 shadow-sm">
            <FiFilter className="text-primary-600" />
            Filter catalog
          </div>
        </div>

        <div className="mb-8 flex flex-wrap items-center justify-center gap-3">
          {filters.map((filter) => (
            <button
              key={filter.key}
              onClick={() => setActiveTab(filter.key)}
              aria-pressed={activeTab === filter.key}
              className={`rounded-full border px-5 py-2.5 text-sm font-semibold transition-all duration-300 ${
                activeTab === filter.key
                  ? "border-primary-600 bg-primary-600 text-white shadow-md"
                  : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:-translate-y-0.5"
              }`}
            >
              {filter.label}
              <span
                className={`ml-2 text-xs ${
                  activeTab === filter.key ? "text-primary-100" : "text-gray-500"
                }`}
              >
                {filter.helper}
              </span>
            </button>
          ))}
        </div>

        <div className="mb-8 rounded-2xl border border-gray-200 bg-white/90 px-5 py-4 backdrop-blur-sm shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-gray-600">
              Showing <span className="font-semibold text-gray-900">{filteredProducts.length}</span>{" "}
              products in <span className="font-semibold text-primary-700">{filters.find((f) => f.key === activeTab)?.label}</span>
            </p>
            <p className="inline-flex items-center gap-2 rounded-full bg-rose-50 px-3 py-1 text-sm font-semibold text-primary-700 w-fit">
              <FiPackage />
              Potential minimum-order savings: KES {totalSavings.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Best Seller Carousel</h3>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => scrollProducts("left")}
              aria-label="Scroll products left"
              className="rounded-full border border-gray-300 bg-white p-2 text-gray-700 transition hover:border-primary-400 hover:text-primary-700"
            >
              <FiChevronLeft />
            </button>
            <button
              type="button"
              onClick={() => scrollProducts("right")}
              aria-label="Scroll products right"
              className="rounded-full border border-gray-300 bg-white p-2 text-gray-700 transition hover:border-primary-400 hover:text-primary-700"
            >
              <FiChevronRight />
            </button>
          </div>
        </div>

        <div
          ref={carouselRef}
          className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {filteredProducts.map((product, index) => (
            <div
              key={product.id}
              className="group min-w-[74%] snap-start overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl sm:min-w-[290px] xl:min-w-[270px] animate-rise"
              style={{ animationDelay: `${index * 70}ms` }}
            >
              <div className="relative h-52 overflow-hidden bg-gray-100">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="(max-width: 640px) 82vw, (max-width: 1280px) 340px, 320px"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {product.discount > 0 && (
                  <div className="absolute left-3 top-3 rounded-full bg-rose-500 px-3 py-1 text-sm font-bold text-white shadow-md">
                    SAVE {product.discount}%
                  </div>
                )}

                {bestSellerIds.includes(product.id) && (
                  <div className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-amber-300 px-3 py-1 text-xs font-bold text-amber-950 shadow-md">
                    <FiAward /> Best Seller
                  </div>
                )}

                <div className="absolute inset-0 flex items-center justify-center gap-3 bg-black/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <Link
                    href={`/products/${product.id}`}
                    className="rounded-full bg-white p-3 text-gray-900 shadow-md transition hover:bg-primary-600 hover:text-white"
                    aria-label={`Preview ${product.name}`}
                  >
                    <FiEye className="text-xl" />
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleAddToCart(product)}
                    className="rounded-full bg-white p-3 text-gray-900 shadow-md transition hover:bg-primary-600 hover:text-white"
                    aria-label={`Add ${product.name} to cart`}
                  >
                    <FiShoppingCart className="text-xl" />
                  </button>
                </div>
              </div>

              <div className="p-4">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  {product.category}
                </p>
                <h3 className="mb-2 line-clamp-2 text-base font-semibold text-gray-900">
                  {product.name}
                </h3>

                <div className="mb-3 rounded-xl bg-gray-50 p-2.5">
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-bold text-primary-700">
                      KES {product.bulkPrice.toLocaleString()}
                    </span>
                    <span className="text-sm text-gray-500 line-through decoration-1">
                      KES {product.price.toLocaleString()}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">Wholesale unit rate</p>
                </div>

                <div className="mb-3 flex items-center justify-between text-xs text-gray-600">
                  <p>
                    Min. order: <span className="font-semibold text-gray-800">{product.minOrder} units</span>
                  </p>
                  <p>
                    Save/unit:{" "}
                    <span className="font-semibold text-primary-700">
                      KES {(product.price - product.bulkPrice).toLocaleString()}
                    </span>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleAddToCart(product)}
                    className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2 font-medium text-white transition ${
                      addedProductId === product.id ? "bg-emerald-600 animate-cart-bump" : "bg-primary-600 hover:bg-primary-700"
                    }`}
                  >
                    {addedProductId === product.id ? <FiCheckCircle /> : <FiShoppingCart />}
                    {addedProductId === product.id ? "Added" : "Add to Cart"}
                  </button>
                  <Link
                    href={`/products/${product.id}`}
                    className="inline-flex items-center justify-center rounded-lg border border-gray-300 p-2 text-gray-700 transition hover:border-primary-600 hover:text-primary-700"
                    aria-label={`View details for ${product.name}`}
                  >
                    <FiArrowRight />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-8 py-3 font-semibold text-white transition hover:bg-gray-800"
          >
            View All Products
            <FiArrowRight />
          </Link>
        </div>
      </div>
    </section>
  );
}
