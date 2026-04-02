"use client";

import { useEffect, useRef, useState } from "react";
import { ProductCard } from "./ProductCard";

interface ProductsListProps {
  category?: string;
  search?: string;
  sellerId?: string;
}

const SEARCH_DEBOUNCE_MS = 350;

export function ProductsList({
  category: initialCategory,
  search: initialSearch,
  sellerId,
}: ProductsListProps) {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState(initialCategory || "");
  const [search, setSearch] = useState(initialSearch || "");
  const [debouncedSearch, setDebouncedSearch] = useState(initialSearch || "");
  const [sortBy, setSortBy] = useState("newest");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const limit = 20;
  const skip = (page - 1) * limit;

  // Fetch products only when debounced search / filters change
  useEffect(() => {
    loadProducts();
  }, [debouncedSearch, category, sortBy, page, sellerId, coordinates]);

  // Fetch categories once on mount — independent of filter changes
  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !window.navigator?.geolocation) {
      return;
    }

    window.navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoordinates({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      () => {
        // Keep location optional so product browsing still works without permission.
        setCoordinates(null);
      },
      {
        enableHighAccuracy: false,
        timeout: 4000,
        maximumAge: 10 * 60 * 1000,
      }
    );
  }, []);

  async function loadProducts() {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        limit: String(limit),
        skip: String(skip),
        sort: sortBy,
        ...(debouncedSearch && { search: debouncedSearch }),
        ...(category && { category }),
        ...(sellerId && { sellerId }),
        ...(coordinates
          ? {
              lat: String(coordinates.lat),
              lng: String(coordinates.lng),
              radiusKm: "25",
            }
          : {}),
      });

      const res = await fetch(`/api/v1/products?${params}`);
      const data = await res.json();

      setProducts(data.data);
      setTotal(data.meta.total);
    } catch (error) {
      console.error("Failed to load products:", error);
    } finally {
      setLoading(false);
    }
  }

  async function loadCategories() {
    try {
      const res = await fetch("/api/v1/categories");
      const data = await res.json();
      setCategories(data.categories);
    } catch (error) {
      console.error("Failed to load categories:", error);
    }
  }

  const handleSearchChange = (value: string) => {
    setSearch(value);
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      setDebouncedSearch(value);
      setPage(1);
    }, SEARCH_DEBOUNCE_MS);
  };

  const handleCategoryChange = (cat: string) => {
    setCategory(cat === category ? "" : cat);
    setPage(1);
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Search products by name, SKU..."
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="flex-1 px-4 py-3 border rounded-lg focus:outline-none focus:border-blue-500"
        />
        <button
          onClick={() => {
            setSearch("");
            setDebouncedSearch("");
            setCategory("");
            setPage(1);
          }}
          className="px-4 py-3 text-gray-600 hover:bg-gray-100 border rounded-lg"
        >
          Clear Filters
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar - Filters */}
        <div className="lg:col-span-1 space-y-4">
          {/* Categories */}
          <div className="bg-white p-4 rounded-lg border">
            <h3 className="font-bold mb-3">Categories</h3>
            <div className="space-y-2">
              {categories.map((cat) => (
                <label key={cat.name} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={category === cat.name}
                    onChange={() => handleCategoryChange(cat.name)}
                    className="rounded"
                  />
                  <span className="text-sm flex-1">{cat.name}</span>
                  <span className="text-xs text-gray-500">({cat.count})</span>
                </label>
              ))}
            </div>
          </div>

          {/* Sort */}
          <div className="bg-white p-4 rounded-lg border">
            <h3 className="font-bold mb-3">Sort By</h3>
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 border rounded-lg text-sm"
            >
              <option value="newest">Newest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Results Info */}
          <div className="flex justify-between items-center">
            <p className="text-gray-600">
              Showing <span className="font-semibold">{products.length}</span> of{" "}
              <span className="font-semibold">{total}</span> products
            </p>
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Loading products...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">No products found</p>
              <button
                onClick={() => {
                  setSearch("");
                  setCategory("");
                  setPage(1);
                }}
                className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg border border-blue-600"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center gap-2">
                  <button
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 border rounded-lg disabled:opacity-50"
                  >
                    ← Previous
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-10 h-10 rounded-lg border ${
                        page === p
                          ? "bg-blue-600 text-white border-blue-600"
                          : "hover:border-blue-400"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                  <button
                    onClick={() => setPage(Math.min(totalPages, page + 1))}
                    disabled={page === totalPages}
                    className="px-4 py-2 border rounded-lg disabled:opacity-50"
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
