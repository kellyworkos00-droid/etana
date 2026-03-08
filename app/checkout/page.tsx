"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { FiChevronLeft, FiCreditCard, FiMapPin, FiTruck } from "react-icons/fi";
import { createOrderInApi } from "@/lib/store-api";

type PaymentMethod = "CARD" | "MPESA" | "BANK" | "COD";

type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

const fallbackItems: CartItem[] = [
  { id: "1", name: "Premium Rice (50kg Bag)", quantity: 2, price: 4200 },
  { id: "2", name: "Cooking Oil (20L Jerry Can)", quantity: 1, price: 2950 },
  { id: "4", name: "Detergent Powder (25kg)", quantity: 1, price: 2500 },
];

function getCartItems(): CartItem[] {
  if (typeof window === "undefined") {
    return fallbackItems;
  }

  try {
    const value = window.localStorage.getItem("eterna-cart");
    if (!value) {
      return fallbackItems;
    }

    const parsed = JSON.parse(value) as Array<{ id: string; name: string; price: number; quantity: number }>;
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return fallbackItems;
    }

    return parsed.map((item) => ({
      id: String(item.id),
      name: item.name,
      price: Number(item.price),
      quantity: Number(item.quantity),
    }));
  } catch {
    return fallbackItems;
  }
}

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

  const orderItems = useMemo(() => getCartItems(), []);
  const subtotal = useMemo(() => orderItems.reduce((sum, item) => sum + item.quantity * item.price, 0), [orderItems]);
  const shipping = 750;
  const total = subtotal + shipping;

  const handleCheckout = async () => {
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
        items: orderItems.map((item) => ({
          productId: String(item.id),
          quantity: item.quantity,
        })),
      });

      setMessage(order?.orderNumber ? `Order created: ${order.orderNumber}` : "Order created successfully.");
      window.localStorage.removeItem("eterna-cart");
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

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <section className="space-y-6 lg:col-span-2">
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

          <aside className="lg:col-span-1">
            <div className="sticky top-28 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm md:p-6">
              <div className="mb-4 flex items-center gap-2">
                <FiTruck className="text-primary-600" />
                <h2 className="text-lg font-semibold text-gray-900">Order Summary</h2>
              </div>

              <div className="space-y-3 border-b border-gray-200 pb-4">
                {orderItems.map((item) => (
                  <div key={item.id} className="flex items-start justify-between gap-3 text-sm">
                    <p className="text-gray-700">{item.name}<span className="ml-1 text-gray-500">x{item.quantity}</span></p>
                    <p className="font-semibold text-gray-900">KES {(item.quantity * item.price).toLocaleString()}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-2 py-4 text-sm">
                <div className="flex items-center justify-between text-gray-600"><span>Subtotal</span><span>KES {subtotal.toLocaleString()}</span></div>
                <div className="flex items-center justify-between text-gray-600"><span>Shipping</span><span>KES {shipping.toLocaleString()}</span></div>
                <div className="flex items-center justify-between border-t border-gray-200 pt-3 text-base font-bold text-gray-900"><span>Total</span><span>KES {total.toLocaleString()}</span></div>
              </div>

              <button onClick={handleCheckout} disabled={submitting} className="w-full rounded-lg bg-primary-600 py-3 font-semibold text-white transition hover:bg-primary-700 disabled:opacity-70">
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
