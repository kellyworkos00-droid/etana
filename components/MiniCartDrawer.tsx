"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { FiMinus, FiPlus, FiShoppingBag, FiTrash2, FiX } from "react-icons/fi";
import {
  CART_UPDATED_EVENT,
  clearCart,
  getCartItems,
  removeCartItem,
  updateCartItemQuantity,
  type CartItem,
} from "@/lib/cart";

type MiniCartDrawerProps = {
  open: boolean;
  onClose: () => void;
};

export default function MiniCartDrawer({ open, onClose }: MiniCartDrawerProps) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const sync = () => setItems(getCartItems());
    sync();

    window.addEventListener(CART_UPDATED_EVENT, sync);
    return () => window.removeEventListener(CART_UPDATED_EVENT, sync);
  }, []);

  useEffect(() => {
    if (!open) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  const subtotal = useMemo(() => items.reduce((sum, item) => sum + item.price * item.quantity, 0), [items]);

  const changeQuantity = (item: CartItem, delta: number) => {
    const minQty = Math.max(1, item.minOrder ?? 1);
    const nextQty = Math.max(minQty, item.quantity + delta);
    updateCartItemQuantity(item.id, nextQty);
    setItems(getCartItems());
  };

  const deleteItem = (id: string) => {
    removeCartItem(id);
    setItems(getCartItems());
  };

  const wipeCart = () => {
    clearCart();
    setItems([]);
  };

  return (
    <>
      <div
        onClick={onClose}
        className={`fixed inset-0 z-[70] bg-black/45 transition-opacity duration-300 ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        className={`fixed right-0 top-0 z-[80] flex h-screen w-full max-w-md flex-col border-l border-rose-100 bg-white shadow-2xl transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-label="Mini cart"
        aria-modal="true"
      >
        <header className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
          <div className="inline-flex items-center gap-2 text-gray-900">
            <FiShoppingBag className="text-primary-700" />
            <h2 className="text-lg font-bold">Mini Cart</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close mini cart"
            className="rounded-md border border-gray-300 p-2 text-gray-700 hover:text-primary-700"
          >
            <FiX />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 px-4 py-8 text-center">
              <p className="text-base font-semibold text-gray-800">Your cart is empty</p>
              <p className="mt-1 text-sm text-gray-600">Add products to continue.</p>
              <Link
                href="/products"
                onClick={onClose}
                className="mt-4 inline-flex rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700"
              >
                Browse Products
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item) => (
                <article key={item.id} className="rounded-xl border border-gray-200 p-3">
                  <div className="flex items-start gap-3">
                    <div className="relative h-14 w-14 overflow-hidden rounded-lg bg-gray-100">
                      {item.image ? <Image src={item.image} alt={item.name} fill sizes="56px" className="object-cover" /> : null}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-2 text-sm font-semibold text-gray-900">{item.name}</p>
                      <p className="mt-1 text-xs text-gray-500">KES {item.price.toLocaleString()} each</p>

                      <div className="mt-2 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => changeQuantity(item, -1)}
                          className="rounded-md border border-gray-300 p-1.5 text-gray-700 hover:text-primary-700"
                          aria-label={`Decrease quantity for ${item.name}`}
                        >
                          <FiMinus />
                        </button>
                        <span className="min-w-[34px] text-center text-sm font-semibold text-gray-900">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => changeQuantity(item, 1)}
                          className="rounded-md border border-gray-300 p-1.5 text-gray-700 hover:text-primary-700"
                          aria-label={`Increase quantity for ${item.name}`}
                        >
                          <FiPlus />
                        </button>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-sm font-bold text-gray-900">KES {(item.price * item.quantity).toLocaleString()}</p>
                      <button
                        type="button"
                        onClick={() => deleteItem(item.id)}
                        className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-rose-700 hover:text-rose-800"
                      >
                        <FiTrash2 /> Remove
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        <footer className="border-t border-gray-200 px-5 py-4">
          <div className="mb-3 flex items-center justify-between text-sm text-gray-700">
            <span>Subtotal</span>
            <span className="font-bold text-gray-900">KES {subtotal.toLocaleString()}</span>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={wipeCart}
              disabled={items.length === 0}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Clear
            </button>
            <Link
              href="/checkout"
              onClick={onClose}
              className="flex-1 rounded-lg bg-primary-600 px-4 py-2 text-center text-sm font-semibold text-white hover:bg-primary-700"
            >
              Checkout Fast
            </Link>
          </div>
        </footer>
      </aside>
    </>
  );
}
