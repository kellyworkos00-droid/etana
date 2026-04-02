"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useCart } from "@/hooks/useCart";

interface ProductDetailsProps {
  slug: string;
}

export function ProductDetails({ slug }: ProductDetailsProps) {
  const [product, setProduct] = useState<any>(null);
  const [quantity, setQuantity] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  useEffect(() => {
    loadProduct();
  }, [slug]);

  async function loadProduct() {
    setLoading(true);
    try {
      const res = await fetch(`/api/v1/products/${slug}`);
      if (!res.ok) throw new Error("Product not found");
      const data = await res.json();
      setProduct(data);
      setQuantity(String(data.minOrder || 1));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value) || 0;
    if (product.minOrder && val < product.minOrder) {
      setQuantity(String(product.minOrder));
    } else if (product.maxOrder && val > product.maxOrder) {
      setQuantity(String(product.maxOrder));
    } else {
      setQuantity(String(val));
    }
  };

  const handleAddToCart = () => {
    if (!product || !quantity) return;

    const qty = parseInt(quantity);
    if (qty < product.minOrder) {
      setError(`Minimum order is ${product.minOrder} units`);
      return;
    }
    if (product.maxOrder && qty > product.maxOrder) {
      setError(`Maximum order is ${product.maxOrder} units`);
      return;
    }

    addItem({
      productId: product.id,
      name: product.name,
      imageUrl: product.imageUrl,
      price: product.price,
      bulkPrice: product.bulkPrice,
      quantity: qty,
      minOrder: product.minOrder,
      maxOrder: product.maxOrder,
      sellerId: product.seller?.id || product.sellerId || "",
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) {
    return <div className="text-center py-12">Loading product...</div>;
  }

  if (error || !product) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error || "Product not found"}</p>
        <a href="/products" className="text-blue-600 hover:underline">
          ← Back to products
        </a>
      </div>
    );
  }

  const discountedPrice = product.price * (1 - (product.discountPct || 0) / 100);
  const currentPrice =
    parseInt(quantity) >= product.minOrder ? product.bulkPrice : product.price;
  const currentDiscounted =
    currentPrice * (1 - (product.discountPct || 0) / 100);
  const totalPrice = currentDiscounted * parseInt(quantity);

  return (
    <div className="space-y-6">
      <a href="/products" className="text-blue-600 hover:underline">
        ← Back to products
      </a>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Image */}
        <div className="bg-gray-100 rounded-lg overflow-hidden">
          <Image
            src={product.imageUrl}
            alt={product.name}
            width={500}
            height={500}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = "/placeholder-product.jpg";
            }}
          />
        </div>

        {/* Details */}
        <div className="space-y-4">
          {/* Seller Info */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <p className="text-sm text-gray-600 mb-1">Sold by</p>
            <div className="flex items-center gap-3">
              {product.seller.logo && (
                <img
                  src={product.seller.logo}
                  alt={product.seller.businessName}
                  className="w-8 h-8 rounded-full"
                />
              )}
              <div className="flex-1">
                <p className="font-semibold">{product.seller.businessName}</p>
                <p className="text-sm text-gray-600">{product.seller.businessType}</p>
              </div>
              {product.seller.rating > 0 && (
                <p className="text-yellow-500 font-semibold">⭐ {product.seller.rating}/5</p>
              )}
            </div>
          </div>

          {/* Product Title */}
          <div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <p className="text-gray-600 mt-1">SKU: {product.sku}</p>
          </div>

          {/* Pricing */}
          <div className="space-y-2 p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm text-gray-600">Price per unit</p>
              <div className="flex items-center gap-2">
                <span className="text-3xl font-bold text-blue-600">
                  KES {currentDiscounted.toLocaleString(undefined, {
                    maximumFractionDigits: 0,
                  })}
                </span>
                {product.discountPct > 0 && (
                  <>
                    <span className="text-lg text-gray-500 line-through">
                      KES {currentPrice.toLocaleString(undefined, {
                        maximumFractionDigits: 0,
                      })}
                    </span>
                    <span className="bg-red-500 text-white px-2 py-1 rounded text-sm font-bold">
                      -{product.discountPct}%
                    </span>
                  </>
                )}
              </div>
            </div>

            {product.bulkPrice < product.price && (
              <div className="text-sm text-gray-600">
                Bulk Pricing: KES{" "}
                {(product.bulkPrice * (1 - (product.discountPct || 0) / 100)).toLocaleString(
                  undefined,
                  { maximumFractionDigits: 0 }
                )}{" "}
                (Order {product.minOrder}+ units)
              </div>
            )}
          </div>

          {/* Quantity Selector */}
          <div className="space-y-2">
            <label className="block font-semibold">Order Quantity</label>
            <div className="flex gap-2 items-end">
              <div className="flex-1">
                <input
                  type="number"
                  value={quantity}
                  onChange={handleQuantityChange}
                  min={product.minOrder}
                  max={product.maxOrder || undefined}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Min: {product.minOrder}
                  {product.maxOrder && ` | Max: ${product.maxOrder}`}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-bold text-blue-600">
                  KES {totalPrice.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </p>
              </div>
            </div>
          </div>

          {/* Stock Status */}
          <div
            className={`p-4 rounded-lg ${
              product.stockQty > 0
                ? "bg-green-50 border border-green-200"
                : "bg-red-50 border border-red-200"
            }`}
          >
            {product.stockQty > 0 ? (
              <p className="text-green-800 font-semibold">
                ✅ {product.stockQty} units in stock (Ready to ship)
              </p>
            ) : (
              <p className="text-red-800 font-semibold">❌ Out of stock</p>
            )}
          </div>

          {/* Add to Cart */}
          <button
            onClick={handleAddToCart}
            disabled={product.stockQty === 0}
            className={`w-full py-3 rounded-lg font-semibold text-lg transition ${
              product.stockQty === 0
                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {added ? "✅ Added to Cart" : "Add to Cart"}
          </button>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          {/* Description */}
          {product.description && (
            <div className="border-t pt-4">
              <h3 className="font-semibold mb-2">Product Details</h3>
              <p className="text-gray-700 whitespace-pre-wrap">{product.description}</p>
            </div>
          )}

          {/* Seller Info */}
          <div className="bg-gray-50 p-4 rounded-lg space-y-2 border-t">
            <h3 className="font-semibold">Contact Seller</h3>
            <p className="text-sm">
              📧 <a href={`mailto:${product.seller.email}`} className="text-blue-600 hover:underline">
                {product.seller.email}
              </a>
            </p>
            <p className="text-sm">
              📞 <a href={`tel:${product.seller.phone}`} className="text-blue-600 hover:underline">
                {product.seller.phone}
              </a>
            </p>
            {product.seller.address && (
              <p className="text-sm">📍 {product.seller.address}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
