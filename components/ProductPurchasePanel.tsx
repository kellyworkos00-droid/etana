"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { FiCheckCircle, FiMinus, FiPlus, FiShoppingCart } from "react-icons/fi";

type ProductPurchasePanelProps = {
  id: string;
  name: string;
  image: string;
  price: number;
  minOrder: number;
};

type CartItem = {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  minOrder: number;
};

const CART_STORAGE_KEY = "eterna-cart";

export default function ProductPurchasePanel({ id, name, image, price, minOrder }: ProductPurchasePanelProps) {
  const [quantity, setQuantity] = useState(minOrder);
  const [added, setAdded] = useState(false);

  const orderValue = useMemo(() => quantity * price, [quantity, price]);

  const decreaseQty = () => {
    setQuantity((current) => Math.max(minOrder, current - 1));
  };

  const increaseQty = () => {
    setQuantity((current) => current + 1);
  };

  const addToCart = () => {
    try {
      const stored = window.localStorage.getItem(CART_STORAGE_KEY);
      const existing: CartItem[] = stored ? (JSON.parse(stored) as CartItem[]) : [];

      const currentIndex = existing.findIndex((item) => item.id === id);
      if (currentIndex >= 0) {
        existing[currentIndex].quantity += quantity;
      } else {
        existing.push({ id, name, image, price, quantity, minOrder });
      }

      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(existing));
      setAdded(true);
      window.setTimeout(() => setAdded(false), 1800);
    } catch {
      setAdded(false);
    }
  };

  return (
    <div className="mt-6 rounded-2xl border border-rose-100 bg-white p-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wide text-gray-500">Order quantity</p>
          <p className="text-sm text-gray-600">Minimum: {minOrder} units</p>
        </div>

        <div className="inline-flex items-center rounded-xl border border-gray-300 bg-white">
          <button
            type="button"
            onClick={decreaseQty}
            className="p-2.5 text-gray-700 transition hover:text-primary-700"
            aria-label="Decrease quantity"
          >
            <FiMinus />
          </button>
          <span className="min-w-[54px] border-x border-gray-300 px-3 py-2 text-center text-sm font-semibold text-gray-900">
            {quantity}
          </span>
          <button
            type="button"
            onClick={increaseQty}
            className="p-2.5 text-gray-700 transition hover:text-primary-700"
            aria-label="Increase quantity"
          >
            <FiPlus />
          </button>
        </div>
      </div>

      <div className="mt-4 rounded-xl bg-rose-50/50 px-3 py-2 text-sm text-gray-700">
        Estimated order value: <span className="font-semibold text-primary-700">KES {orderValue.toLocaleString()}</span>
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={addToCart}
          className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-700"
        >
          <FiShoppingCart /> Add to Cart
        </button>

        <Link
          href="/checkout"
          className="inline-flex items-center rounded-xl border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-700 transition hover:border-primary-300 hover:text-primary-700"
        >
          Go to Checkout
        </Link>
      </div>

      {added ? (
        <p className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-emerald-700">
          <FiCheckCircle /> Added to cart successfully
        </p>
      ) : null}
    </div>
  );
}
