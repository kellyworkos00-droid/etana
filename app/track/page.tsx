"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { FiSearch, FiTruck } from "react-icons/fi";

export default function TrackOrderEntryPage() {
  const router = useRouter();
  const [orderNumber, setOrderNumber] = useState("");
  const [error, setError] = useState<string | null>(null);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalized = orderNumber.trim().toUpperCase();
    if (!normalized || normalized.length < 5) {
      setError("Enter a valid order number (for example: ETR-1234567890).");
      return;
    }

    setError(null);
    router.push(`/track/${encodeURIComponent(normalized)}`);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-rose-50/40 pt-28 pb-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-rose-100 bg-white p-6 shadow-lg shadow-rose-100/50 sm:p-10">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary-700">
            <FiTruck /> Track Delivery
          </div>

          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">Track Your Order</h1>
          <p className="mt-3 text-sm text-gray-600 sm:text-base">
            Enter your order number to view real-time status, delivery progress, and rider details.
          </p>

          <form onSubmit={onSubmit} className="mt-8 space-y-3">
            <label className="block text-sm font-semibold text-gray-700" htmlFor="order-number">
              Order Number
            </label>
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                id="order-number"
                type="text"
                value={orderNumber}
                onChange={(event) => setOrderNumber(event.target.value)}
                placeholder="ETR-1234567890"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm uppercase tracking-wide text-gray-900 outline-none transition focus:border-primary-500"
              />
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-700"
              >
                <FiSearch /> Track
              </button>
            </div>
            {error ? <p className="text-sm text-rose-600">{error}</p> : null}
          </form>
        </div>
      </div>
    </main>
  );
}
