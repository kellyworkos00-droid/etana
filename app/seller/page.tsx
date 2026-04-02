"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { fetchSellerProducts, registerSeller, createSellerProduct } from "@/lib/seller-api";
import Link from "next/link";

type SellerProduct = {
  id: string;
  sku: string;
  name: string;
  category: string;
  imageUrl: string;
  price: number;
  bulkPrice: number;
  minOrder: number;
  stockQty: number;
  discountPct: number;
  isActive: boolean;
};

function getStoredSellerId() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem("sellerId");
}

export default function SellerPage() {
  const [sellerId, setSellerId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [products, setProducts] = useState<SellerProduct[]>([]);

  const [bizName, setBizName] = useState("");
  const [bizType, setBizType] = useState("");
  const [bizEmail, setBizEmail] = useState("");
  const [bizPhone, setBizPhone] = useState("");
  const [bizAddress, setBizAddress] = useState("");
  const [bizDescription, setBizDescription] = useState("");

  const [productName, setProductName] = useState("");
  const [productSku, setProductSku] = useState("");
  const [productCategory, setProductCategory] = useState("");
  const [productPrice, setProductPrice] = useState(0);
  const [productBulkPrice, setProductBulkPrice] = useState(0);
  const [productMinOrder, setProductMinOrder] = useState(1);
  const [productStock, setProductStock] = useState(0);
  const [productImage, setProductImage] = useState("");
  const [productDiscount, setProductDiscount] = useState(0);

  const productCategories = useMemo(
    () => [
      "Hardware & Tools",
      "Building Materials",
      "Electronics",
      "Plumbing",
      "Electrical",
      "Paint & Coatings",
      "Safety Equipment",
      "Groceries",
      "Home & Living",
      "Health & Beauty",
    ],
    []
  );

  useEffect(() => {
    const stored = getStoredSellerId();
    if (stored) {
      setSellerId(stored);
    }
  }, []);

  useEffect(() => {
    if (!sellerId) return;

    setIsLoading(true);
    fetchSellerProducts(sellerId)
      .then((resp) => {
        setProducts(resp.products);
        setError(null);
      })
      .catch((err) => {
        console.error(err);
        setError("Could not load seller products. Please try again.");
      })
      .finally(() => setIsLoading(false));
  }, [sellerId]);

  const register = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await registerSeller({
        businessName: bizName,
        businessType: bizType,
        email: bizEmail,
        phone: bizPhone,
        address: bizAddress,
        description: bizDescription,
      });

      const id = result.seller?.id;
      if (!id) {
        throw new Error("Invalid seller response");
      }

      window.localStorage.setItem("sellerId", id);
      setSellerId(id);
      setSuccess("Seller account created successfully! You can now list products.");
      setError(null);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to register seller.");
      setSuccess(null);
    } finally {
      setIsLoading(false);
    }
  };

  const addProduct = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!sellerId) return;

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const created = await createSellerProduct(sellerId, {
        name: productName,
        sku: productSku,
        category: productCategory,
        description: "",
        imageUrl: productImage,
        price: productPrice,
        bulkPrice: productBulkPrice || productPrice,
        minOrder: productMinOrder,
        stockQty: productStock,
        discountPct: productDiscount,
      });

      setProducts((prev) => [created.product as SellerProduct, ...prev]);
      setSuccess("Product added successfully.");
      setError(null);
      setProductName("");
      setProductSku("");
      setProductCategory("");
      setProductPrice(0);
      setProductBulkPrice(0);
      setProductMinOrder(1);
      setProductStock(0);
      setProductImage("");
      setProductDiscount(0);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to add product.");
      setSuccess(null);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    window.localStorage.removeItem("sellerId");
    setSellerId(null);
    setProducts([]);
    setSuccess(null);
    setError(null);
  };

  return (
    <main className="mx-auto max-w-6xl py-16 px-4 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Seller Center</h1>
          <p className="text-gray-600 mt-1">List your stock, manage products, and reach buyers quickly.</p>
        </div>
        <Link
          href="/products"
          className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
        >
          Shop as Buyer
        </Link>
      </div>

      {error ? (
        <div className="mb-3 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>
      ) : null}
      {success ? (
        <div className="mb-3 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{success}</div>
      ) : null}

      {!sellerId ? (
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900">Become a seller</h2>
          <p className="mb-4 text-sm text-gray-600">Create your seller account and start listing products.</p>

          <form onSubmit={register} className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <label className="text-sm text-gray-700">
              Business name
              <input
                value={bizName}
                onChange={(e) => setBizName(e.target.value)}
                required
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5"
              />
            </label>
            <label className="text-sm text-gray-700">
              Business type
              <input
                value={bizType}
                onChange={(e) => setBizType(e.target.value)}
                required
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5"
              />
            </label>
            <label className="text-sm text-gray-700">
              Email
              <input
                value={bizEmail}
                onChange={(e) => setBizEmail(e.target.value)}
                type="email"
                required
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5"
              />
            </label>
            <label className="text-sm text-gray-700">
              Phone
              <input
                value={bizPhone}
                onChange={(e) => setBizPhone(e.target.value)}
                required
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5"
              />
            </label>
            <label className="text-sm text-gray-700 md:col-span-2">
              Address
              <input
                value={bizAddress}
                onChange={(e) => setBizAddress(e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5"
              />
            </label>
            <label className="text-sm text-gray-700 md:col-span-2">
              Description
              <textarea
                value={bizDescription}
                onChange={(e) => setBizDescription(e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5"
              />
            </label>
            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={isLoading}
                className="rounded-lg bg-primary-600 px-4 py-2 text-white hover:bg-primary-700 disabled:opacity-70"
              >
                {isLoading ? "Creating..." : "Create Seller Account"}
              </button>
            </div>
          </form>
        </section>
      ) : (
        <section className="space-y-6">
          <div className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white p-4">
            <h2 className="text-xl font-semibold text-gray-900">My Products</h2>
            <button
              onClick={logout}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Logout seller
            </button>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900">Add new product</h3>
            <form onSubmit={addProduct} className="grid grid-cols-1 gap-4 pt-4 md:grid-cols-2">
              <label className="text-sm text-gray-700">
                Product name
                <input
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  required
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5"
                />
              </label>
              <label className="text-sm text-gray-700">
                SKU
                <input
                  value={productSku}
                  onChange={(e) => setProductSku(e.target.value)}
                  required
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5"
                />
              </label>
              <label className="text-sm text-gray-700">
                Category
                <select
                  value={productCategory}
                  onChange={(e) => setProductCategory(e.target.value)}
                  required
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5"
                >
                  <option value="">-- Select category --</option>
                  {productCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </label>
              <label className="text-sm text-gray-700">
                Image URL
                <input
                  value={productImage}
                  onChange={(e) => setProductImage(e.target.value)}
                  placeholder="https://..."
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5"
                />
              </label>
              <label className="text-sm text-gray-700">
                Price (KES)
                <input
                  type="number"
                  value={productPrice}
                  onChange={(e) => setProductPrice(Number(e.target.value))}
                  min={1}
                  required
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5"
                />
              </label>
              <label className="text-sm text-gray-700">
                Bulk Price (KES)
                <input
                  type="number"
                  value={productBulkPrice}
                  onChange={(e) => setProductBulkPrice(Number(e.target.value))}
                  min={1}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5"
                />
              </label>
              <label className="text-sm text-gray-700">
                Min Order
                <input
                  type="number"
                  value={productMinOrder}
                  onChange={(e) => setProductMinOrder(Number(e.target.value))}
                  min={1}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5"
                />
              </label>
              <label className="text-sm text-gray-700">
                Stock quantity
                <input
                  type="number"
                  value={productStock}
                  onChange={(e) => setProductStock(Number(e.target.value))}
                  min={0}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5"
                />
              </label>
              <label className="text-sm text-gray-700">
                Discount (%)
                <input
                  type="number"
                  value={productDiscount}
                  onChange={(e) => setProductDiscount(Number(e.target.value))}
                  min={0}
                  max={100}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5"
                />
              </label>
              <div className="md:col-span-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="rounded-lg bg-primary-600 px-4 py-2 text-white hover:bg-primary-700 disabled:opacity-70"
                >
                  {isLoading ? "Adding..." : "Add Product"}
                </button>
              </div>
            </form>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900">Your currently listed products</h3>
            {isLoading ? (
              <p className="mt-4 text-sm text-gray-600">Loading…</p>
            ) : products.length === 0 ? (
              <p className="mt-4 text-sm text-gray-600">No products found yet.</p>
            ) : (
              <div className="mt-4 grid gap-4 lg:grid-cols-2">
                {products.map((product) => (
                  <article key={product.id} className="rounded-xl border border-gray-200 p-4">
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <h4 className="text-sm font-semibold text-gray-900">{product.name}</h4>
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${product.isActive ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-600"}`}>
                        {product.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">SKU: {product.sku}</p>
                    <p className="mt-1 text-sm text-gray-700">Category: {product.category}</p>
                    <p className="mt-1 text-sm text-gray-700">Price: KES {product.price.toLocaleString()}</p>
                    <p className="mt-1 text-sm text-gray-700">Stock: {product.stockQty}</p>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      )}
    </main>
  );
}
