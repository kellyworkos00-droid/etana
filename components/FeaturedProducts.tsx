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
  FiAward,
  FiCheckCircle,
  FiAlertCircle,
} from "react-icons/fi";
import type { Product } from "@/lib/products";
import { fetchProductsFromApi, LIVE_REFRESH_INTERVAL_MS } from "@/lib/store-api";
import { addItemToCart } from "@/lib/cart";

export default function FeaturedProducts() {
  const [catalog, setCatalog] = useState<Product[]>([]);
  const [addedProductId, setAddedProductId] = useState<string | null>(null);
  const gridRef = useRef<HTMLDivElement | null>(null);

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

  const totalSavings = useMemo(
    () =>
      catalog.reduce((accumulator, product) => {
        const savePerUnit = product.price - product.bulkPrice;
        return accumulator + savePerUnit * product.minOrder;
      }, 0),
    [catalog]
  );

  const bestSellerIds = useMemo(() => {
    return [...catalog]
      .sort((a, b) => b.discount - a.discount)
      .slice(0, 3)
      .map((product) => product.id);
  }, [catalog]);

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
            All Products On Main Page
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8 leading-relaxed">
            Every available product is shown here so buyers can browse the full catalog immediately.
          </p>
        </div>

        <div className="mb-8 rounded-2xl border border-gray-200 bg-white/90 px-5 py-4 backdrop-blur-sm shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-gray-600">
              Showing <span className="font-semibold text-gray-900">{catalog.length}</span> products from the live admin catalog.
            </p>
            <p className="inline-flex items-center gap-2 rounded-full bg-rose-50 px-3 py-1 text-sm font-semibold text-primary-700 w-fit">
              <FiPackage />
              Potential minimum-order savings: KES {totalSavings.toLocaleString()}
            </p>
          </div>
        </div>

        <div
          ref={gridRef}
          className="grid grid-cols-2 gap-2 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4"
        >
          {catalog.length === 0 ? (
            <div className="col-span-full w-full rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-10 text-center">
              <p className="inline-flex items-center gap-2 text-sm font-semibold text-gray-700">
                <FiAlertCircle className="text-primary-700" /> No products yet from admin panel
              </p>
              <p className="mt-2 text-sm text-gray-600">Add products in admin and they will appear here automatically.</p>
            </div>
          ) : null}

          {catalog.map((product, index) => (
            <div
              key={product.id}
              className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg animate-rise"
              style={{ animationDelay: `${index * 70}ms` }}
            >
              <div className="relative h-24 overflow-hidden bg-gray-100 sm:h-44">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="(max-width: 640px) 82vw, (max-width: 1280px) 340px, 320px"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {product.discount > 0 && (
                  <div className="absolute left-1.5 top-1.5 rounded-full bg-rose-500 px-1.5 py-0.5 text-[9px] font-bold text-white shadow-md sm:left-3 sm:top-3 sm:px-3 sm:py-1 sm:text-sm">
                    SAVE {product.discount}%
                  </div>
                )}

                {bestSellerIds.includes(product.id) && (
                  <div className="absolute right-1.5 top-1.5 inline-flex items-center gap-1 rounded-full bg-amber-300 px-1.5 py-0.5 text-[9px] font-bold text-amber-950 shadow-md sm:right-3 sm:top-3 sm:px-3 sm:py-1 sm:text-xs">
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

              <div className="p-2 sm:p-4">
                <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-gray-500 sm:mb-2 sm:text-xs">
                  {product.category}
                </p>
                <h3 className="mb-1 line-clamp-2 text-[11px] font-semibold text-gray-900 sm:mb-2 sm:text-base">
                  {product.name}
                </h3>

                <div className="mb-1.5 rounded-md bg-gray-50 p-1.5 sm:mb-3 sm:rounded-xl sm:p-2.5">
                  <div className="flex items-baseline gap-1.5 sm:gap-2">
                    <span className="text-xs font-bold text-primary-700 sm:text-xl">
                      KES {product.bulkPrice.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-gray-500 line-through decoration-1 sm:text-sm">
                      KES {product.price.toLocaleString()}
                    </span>
                  </div>
                  <p className="mt-0.5 text-[10px] text-gray-500 sm:mt-1 sm:text-xs">Wholesale unit rate</p>
                </div>

                <div className="mb-1.5 flex items-center justify-between text-[9px] text-gray-600 sm:mb-3 sm:text-xs">
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

                <div className="flex items-center gap-1 sm:gap-2">
                  <button
                    type="button"
                    onClick={() => handleAddToCart(product)}
                    className={`flex flex-1 items-center justify-center gap-1 rounded-md py-1 text-[10px] font-medium text-white transition sm:gap-2 sm:rounded-lg sm:py-2 sm:text-sm ${
                      addedProductId === product.id ? "bg-emerald-600 animate-cart-bump" : "bg-primary-600 hover:bg-primary-700"
                    }`}
                  >
                    {addedProductId === product.id ? <FiCheckCircle /> : <FiShoppingCart />}
                    {addedProductId === product.id ? "Added" : "Add to Cart"}
                  </button>
                  <Link
                    href={`/products/${product.id}`}
                    className="inline-flex items-center justify-center rounded-md border border-gray-300 p-1 text-gray-700 transition hover:border-primary-600 hover:text-primary-700 sm:rounded-lg sm:p-2"
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
