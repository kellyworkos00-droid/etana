import Link from "next/link";
import { FiChevronLeft, FiCreditCard, FiMapPin, FiTruck } from "react-icons/fi";

const orderItems = [
  { id: 1, name: "Premium Rice (50kg Bag)", qty: 2, price: 4200 },
  { id: 2, name: "Cooking Oil (20L Jerry Can)", qty: 1, price: 2950 },
  { id: 3, name: "Detergent Powder (25kg)", qty: 1, price: 2500 },
];

const subtotal = orderItems.reduce((sum, item) => sum + item.qty * item.price, 0);
const shipping = 750;
const total = subtotal + shipping;

export default function CheckoutPage() {
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
                  <input
                    type="text"
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                    placeholder="John"
                  />
                </label>
                <label className="text-sm text-gray-700">
                  Last Name
                  <input
                    type="text"
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                    placeholder="Doe"
                  />
                </label>
                <label className="text-sm text-gray-700 sm:col-span-2">
                  Street Address
                  <input
                    type="text"
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                    placeholder="123 Business Street"
                  />
                </label>
                <label className="text-sm text-gray-700">
                  City
                  <input
                    type="text"
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                    placeholder="Nairobi"
                  />
                </label>
                <label className="text-sm text-gray-700">
                  Phone Number
                  <input
                    type="tel"
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                    placeholder="+254 118 407 660"
                  />
                </label>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm md:p-6">
              <div className="mb-5 flex items-center gap-2">
                <FiCreditCard className="text-primary-600" />
                <h2 className="text-lg font-semibold text-gray-900">Payment Info</h2>
              </div>

              <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:border-primary-300">
                  <input type="radio" name="payment" defaultChecked className="accent-primary-600" />
                  Card
                </label>
                <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:border-primary-300">
                  <input type="radio" name="payment" className="accent-primary-600" />
                  M-Pesa
                </label>
                <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:border-primary-300">
                  <input type="radio" name="payment" className="accent-primary-600" />
                  Bank
                </label>
                <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:border-primary-300">
                  <input type="radio" name="payment" className="accent-primary-600" />
                  Cash on Delivery
                </label>
              </div>

              <p className="mb-4 rounded-lg border border-rose-100 bg-rose-50/50 px-3 py-2 text-xs text-gray-600">
                Cash on Delivery is available in selected delivery zones. Our team will confirm eligibility before dispatch.
              </p>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className="text-sm text-gray-700 sm:col-span-2">
                  Card Number
                  <input
                    type="text"
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                    placeholder="1234 5678 9012 3456"
                  />
                </label>
                <label className="text-sm text-gray-700">
                  Expiry Date
                  <input
                    type="text"
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                    placeholder="MM/YY"
                  />
                </label>
                <label className="text-sm text-gray-700">
                  CVV
                  <input
                    type="text"
                    className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                    placeholder="123"
                  />
                </label>
              </div>
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
                    <p className="text-gray-700">
                      {item.name}
                      <span className="ml-1 text-gray-500">x{item.qty}</span>
                    </p>
                    <p className="font-semibold text-gray-900">KES {(item.qty * item.price).toLocaleString()}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-2 py-4 text-sm">
                <div className="flex items-center justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>KES {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>KES {shipping.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between border-t border-gray-200 pt-3 text-base font-bold text-gray-900">
                  <span>Total</span>
                  <span>KES {total.toLocaleString()}</span>
                </div>
              </div>

              <button className="w-full rounded-lg bg-primary-600 py-3 font-semibold text-white transition hover:bg-primary-700">
                Complete Checkout
              </button>

              <p className="mt-3 text-center text-xs text-gray-500">
                Secure checkout. Card and mobile payments are encrypted. Cash on Delivery is supported in eligible areas.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
