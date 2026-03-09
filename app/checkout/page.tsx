"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { FiChevronLeft, FiCreditCard, FiMapPin, FiMinus, FiPlus, FiShoppingBag, FiTrash2, FiTruck } from "react-icons/fi";
import { createOrderInApi, validatePromoCodeInApi } from "@/lib/store-api";
import { clearCart, getCartItems, removeCartItem, updateCartItemQuantity, type CartItem } from "@/lib/cart";

type PaymentMethod = "CARD" | "MPESA" | "BANK" | "COD";

export default function CheckoutPage() {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("CARD");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [promoCode, setPromoCode] = useState("");
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoMessage, setPromoMessage] = useState<string | null>(null);
  const [promoLoading, setPromoLoading] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    setCartItems(getCartItems());
  }, []);

  const subtotal = useMemo(() => cartItems.reduce((sum, item) => sum + item.quantity * item.price, 0), [cartItems]);
  const shipping = 750;
  const total = Math.max(0, subtotal - promoDiscount) + shipping;

  const changeQuantity = (id: string, delta: number) => {
    const target = cartItems.find((item) => item.id === id);
    if (!target) {
      return;
    }

    const minimum = Math.max(1, target.minOrder ?? 1);
    const nextQuantity = Math.max(minimum, target.quantity + delta);
    updateCartItemQuantity(id, nextQuantity);
    setCartItems(getCartItems());
  };

  const handleRemoveItem = (id: string) => {
    removeCartItem(id);
    setCartItems(getCartItems());
  };

  const handleApplyPromo = async () => {
    const code = promoCode.trim().toUpperCase();
    if (!code) {
      setPromoDiscount(0);
      setPromoMessage("Enter a promo code.");
      return;
    }

    setPromoLoading(true);
    setPromoMessage(null);

    const result = await validatePromoCodeInApi({
      code,
      items: cartItems.map((item) => ({
        productId: String(item.id),
        quantity: item.quantity,
      })),
    });

    if (!result) {
      setPromoDiscount(0);
      setPromoMessage("Invalid or expired promo code.");
      setPromoLoading(false);
      return;
    }

    setPromoDiscount(result.discountAmount);
    setPromoMessage(`Promo ${result.code} applied. Saved KES ${result.discountAmount.toLocaleString()}.`);
    setPromoLoading(false);
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      setMessage("Your cart is empty. Add products first.");
      return;
    }

    if (!firstName || !lastName || !addressLine1 || !city || !phone) {
      setMessage("Please fill in required shipping details.");
      return;
    }

    setSubmitting(true);
    setMessage(null);

    try {
      const order = await createOrderInApi({
        customerName: `${firstName} ${lastName}`.trim(),
        customerPhone: phone,
        customerEmail: email || undefined,
        addressLine1,
        city,
        paymentMethod,
        promoCode: promoDiscount > 0 ? promoCode.trim().toUpperCase() : undefined,
        items: cartItems.map((item) => ({
          productId: String(item.id),
          quantity: item.quantity,
        })),
      });

      setMessage(order?.orderNumber ? `Order created: ${order.orderNumber}` : "Order created successfully.");
      clearCart();
      setCartItems([]);
    } catch {
      setMessage("Could not create order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-rose-50/40 pb-24 pt-28 md:pb-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between gap-3">
          <div>
            <h1 className="font-display text-3xl text-gray-900 md:text-4xl">Checkout</h1>
            <p className="mt-2 text-sm text-gray-600">Complete your shipping and payment details.</p>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:border-primary-400 hover:text-primary-700"
          >
            <FiChevronLeft /> Continue Shopping
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.35fr_1fr]">
          <section className="space-y-6 lg:col-span-2">
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm md:p-6">
              <div className="mb-5 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <FiShoppingBag className="text-primary-600" />
                  <h2 className="text-lg font-semibold text-gray-900">Your Cart</h2>
                </div>
                <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-primary-700">
                  {cartItems.reduce((sum, item) => sum + item.quantity, 0)} items
                </span>
              </div>

              {cartItems.length === 0 ? (
                <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 px-4 py-8 text-center">
                  <p className="text-base font-semibold text-gray-800">Your cart is empty</p>
                  <p className="mt-1 text-sm text-gray-600">Add products to continue with checkout.</p>
                  <Link
                    href="/products"
                    className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700"
                  >
                    Browse Products
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {cartItems.map((item) => (
                    <article key={item.id} className="animate-rise rounded-xl border border-gray-200 bg-white p-3">
                      <div className="flex items-start gap-3">
                        <div className="relative h-16 w-16 overflow-hidden rounded-lg bg-gray-100">
                          {item.image ? (
                            <Image src={item.image} alt={item.name} fill sizes="64px" className="object-cover" />
                          ) : null}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="line-clamp-2 text-sm font-semibold text-gray-900">{item.name}</p>
                          <p className="mt-1 text-xs text-gray-500">KES {item.price.toLocaleString()} each</p>
                          <div className="mt-2 flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => changeQuantity(item.id, -1)}
                              className="rounded-md border border-gray-300 p-1.5 text-gray-700 hover:text-primary-700"
                              aria-label={`Decrease quantity for ${item.name}`}
                            >
                              <FiMinus />
                            </button>
                            <span className="min-w-[38px] text-center text-sm font-semibold text-gray-900">{item.quantity}</span>
                            <button
                              type="button"
                              onClick={() => changeQuantity(item.id, 1)}
                              className="rounded-md border border-gray-300 p-1.5 text-gray-700 hover:text-primary-700"
                              aria-label={`Increase quantity for ${item.name}`}
                            >
                              <FiPlus />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveItem(item.id)}
                              className="ml-2 inline-flex items-center gap-1 rounded-md border border-rose-200 px-2 py-1 text-xs font-semibold text-rose-700 hover:bg-rose-50"
                            >
                              <FiTrash2 /> Remove
                            </button>
                          </div>
                        </div>
                        <p className="text-sm font-bold text-gray-900">KES {(item.quantity * item.price).toLocaleString()}</p>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm md:p-6">
              <div className="mb-5 flex items-center gap-2">
                <FiMapPin className="text-primary-600" />
                <h2 className="text-lg font-semibold text-gray-900">Shipping Details</h2>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className="text-sm text-gray-700">
                  First Name
                  <input value={firstName} onChange={(e) => setFirstName(e.target.value)} type="text" className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5" placeholder="John" />
                </label>
                <label className="text-sm text-gray-700">
                  Last Name
                  <input value={lastName} onChange={(e) => setLastName(e.target.value)} type="text" className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5" placeholder="Doe" />
                </label>
                <label className="text-sm text-gray-700 sm:col-span-2">
                  Street Address
                  <input value={addressLine1} onChange={(e) => setAddressLine1(e.target.value)} type="text" className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5" placeholder="123 Business Street" />
                </label>
                <label className="text-sm text-gray-700">
                  City
                  <input value={city} onChange={(e) => setCity(e.target.value)} type="text" className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5" placeholder="Nairobi" />
                </label>
                <label className="text-sm text-gray-700">
                  Phone Number
                  <input value={phone} onChange={(e) => setPhone(e.target.value)} type="tel" className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5" placeholder="+254 118 407 660" />
                </label>
                <label className="text-sm text-gray-700 sm:col-span-2">
                  Email (optional)
                  <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5" placeholder="you@company.com" />
                </label>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm md:p-6">
              <div className="mb-5 flex items-center gap-2">
                <FiCreditCard className="text-primary-600" />
                <h2 className="text-lg font-semibold text-gray-900">Payment Info</h2>
              </div>

              <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {(["CARD", "MPESA", "BANK", "COD"] as const).map((method) => (
                  <label key={method} className="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:border-primary-300">
                    <input type="radio" name="payment" checked={paymentMethod === method} onChange={() => setPaymentMethod(method)} className="accent-primary-600" />
                    {method === "MPESA" ? "M-Pesa" : method === "COD" ? "Cash on Delivery" : method}
                  </label>
                ))}
              </div>

              <p className="rounded-lg border border-rose-100 bg-rose-50/50 px-3 py-2 text-xs text-gray-600">
                Cash on Delivery is available in selected delivery zones. Our team will confirm eligibility before dispatch.
              </p>
            </div>
          </section>

          <aside>
            <div className="sticky top-28 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm md:p-6">
              <div className="mb-4 flex items-center gap-2">
                <FiTruck className="text-primary-600" />
                <h2 className="text-lg font-semibold text-gray-900">Order Summary</h2>
              </div>

              <div className="space-y-3 border-b border-gray-200 pb-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-start justify-between gap-3 text-sm">
                    <p className="text-gray-700">{item.name}<span className="ml-1 text-gray-500">x{item.quantity}</span></p>
                    <p className="font-semibold text-gray-900">KES {(item.quantity * item.price).toLocaleString()}</p>
                  </div>
                ))}
                {cartItems.length === 0 ? <p className="text-sm text-gray-500">No items in cart.</p> : null}
              </div>

              <div className="space-y-2 py-4 text-sm">
                <div className="flex items-center justify-between text-gray-600"><span>Subtotal</span><span>KES {subtotal.toLocaleString()}</span></div>
                <div className="flex items-center justify-between text-gray-600"><span>Discount</span><span>- KES {promoDiscount.toLocaleString()}</span></div>
                <div className="flex items-center justify-between text-gray-600"><span>Shipping</span><span>KES {shipping.toLocaleString()}</span></div>
                <div className="flex items-center justify-between border-t border-gray-200 pt-3 text-base font-bold text-gray-900"><span>Total</span><span>KES {total.toLocaleString()}</span></div>
              </div>

              <div className="mb-4 rounded-lg border border-gray-200 p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Promo Code</p>
                <div className="mt-2 flex gap-2">
                  <input
                    value={promoCode}
                    onChange={(event) => setPromoCode(event.target.value)}
                    placeholder="e.g. KENYA10"
                    disabled={cartItems.length === 0}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  />
                  <button
                    type="button"
                    onClick={handleApplyPromo}
                    disabled={promoLoading || cartItems.length === 0}
                    className="rounded-md border border-gray-300 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-70"
                  >
                    {promoLoading ? "Checking..." : "Apply"}
                  </button>
                </div>
                {promoMessage ? <p className="mt-2 text-xs text-gray-600">{promoMessage}</p> : null}
              </div>

              <button onClick={handleCheckout} disabled={submitting || cartItems.length === 0} className="w-full rounded-lg bg-primary-600 py-3 font-semibold text-white transition hover:bg-primary-700 disabled:opacity-70">
                {submitting ? "Submitting..." : "Complete Checkout"}
              </button>

              {message ? <p className="mt-3 text-center text-xs text-gray-600">{message}</p> : null}
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
