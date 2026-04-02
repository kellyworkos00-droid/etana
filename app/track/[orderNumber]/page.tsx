"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { FiArrowLeft, FiClock, FiMapPin, FiPackage, FiPhone, FiRefreshCw, FiTruck } from "react-icons/fi";
import { BuyerTrackedOrder, fetchOrderByNumberInApi } from "@/lib/store-api";

type TrackOrderPageProps = {
  params: {
    orderNumber: string;
  };
};

const STATUS_SEQUENCE = ["PENDING", "CONFIRMED", "PACKING", "ON_DELIVERY", "DELIVERED"] as const;

const STATUS_LABELS: Record<BuyerTrackedOrder["status"], string> = {
  PENDING: "Order Received",
  PAID: "Payment Confirmed",
  CONFIRMED: "Supplier Confirmed",
  PACKING: "Preparing Items",
  READY_FOR_PICKUP: "Ready for Pickup",
  PICKED_UP: "Picked Up",
  ON_DELIVERY: "On Delivery",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

const ETA_HINTS: Partial<Record<BuyerTrackedOrder["status"], string>> = {
  PENDING: "ETA: 2-4 hours",
  PAID: "ETA: 2-4 hours",
  CONFIRMED: "ETA: 1-3 hours",
  PACKING: "ETA: 60-120 mins",
  READY_FOR_PICKUP: "ETA: 45-90 mins",
  PICKED_UP: "ETA: 20-60 mins",
  ON_DELIVERY: "ETA: 15-45 mins",
  DELIVERED: "Delivered",
};

const STATUS_BADGE_CLASSES: Record<BuyerTrackedOrder["status"], string> = {
  PENDING: "bg-amber-50 text-amber-800 border-amber-200",
  PAID: "bg-emerald-50 text-emerald-800 border-emerald-200",
  CONFIRMED: "bg-sky-50 text-sky-800 border-sky-200",
  PACKING: "bg-indigo-50 text-indigo-800 border-indigo-200",
  READY_FOR_PICKUP: "bg-violet-50 text-violet-800 border-violet-200",
  PICKED_UP: "bg-fuchsia-50 text-fuchsia-800 border-fuchsia-200",
  ON_DELIVERY: "bg-blue-50 text-blue-800 border-blue-200",
  DELIVERED: "bg-emerald-50 text-emerald-800 border-emerald-200",
  CANCELLED: "bg-rose-50 text-rose-800 border-rose-200",
};

function OrderStatusBadge({ status }: { status: BuyerTrackedOrder["status"] }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide ${STATUS_BADGE_CLASSES[status]}`}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}

function toStepIndex(status: BuyerTrackedOrder["status"]) {
  if (status === "PAID") {
    return 1;
  }
  if (status === "READY_FOR_PICKUP" || status === "PICKED_UP") {
    return 3;
  }
  const base = STATUS_SEQUENCE.indexOf(status as (typeof STATUS_SEQUENCE)[number]);
  return base >= 0 ? base : 0;
}

export default function TrackOrderDetailsPage({ params }: TrackOrderPageProps) {
  const normalizedOrderNumber = decodeURIComponent(params.orderNumber ?? "").trim().toUpperCase();
  const [order, setOrder] = useState<BuyerTrackedOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const currentStep = useMemo(() => (order ? toStepIndex(order.status) : 0), [order]);

  const loadOrder = async (isRefresh = false) => {
    if (!normalizedOrderNumber) {
      setError("Invalid order number.");
      setLoading(false);
      return;
    }

    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    const data = await fetchOrderByNumberInApi(normalizedOrderNumber);
    if (!data) {
      setError("Order not found. Confirm the number and try again.");
      setOrder(null);
    } else {
      setError(null);
      setOrder(data);
    }

    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => {
    loadOrder();

    const timer = window.setInterval(() => {
      loadOrder(true);
    }, 20000);

    return () => {
      window.clearInterval(timer);
    };
  }, [normalizedOrderNumber]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-rose-50/40 pt-24 pb-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <Link
            href="/track"
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:border-primary-400 hover:text-primary-700"
          >
            <FiArrowLeft /> Enter another order
          </Link>

          <button
            type="button"
            onClick={() => loadOrder(true)}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:border-primary-400 hover:text-primary-700"
          >
            <FiRefreshCw className={refreshing ? "animate-spin" : ""} /> Refresh
          </button>
        </div>

        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary-700">Order Tracking</p>
          <h1 className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl">{normalizedOrderNumber}</h1>

          {loading ? <p className="mt-6 text-sm text-gray-600">Loading tracking details...</p> : null}
          {!loading && error ? <p className="mt-6 text-sm font-medium text-rose-600">{error}</p> : null}

          {!loading && order ? (
            <div className="mt-6 space-y-8">
              <section className="rounded-2xl border border-gray-200 bg-gray-50 p-4 sm:p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="inline-flex items-center gap-2 text-sm font-semibold text-gray-900">
                    <FiPackage />
                    <OrderStatusBadge status={order.status} />
                  </div>
                  <p className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold text-primary-700">
                    <FiClock /> {ETA_HINTS[order.status] ?? "In progress"}
                  </p>
                </div>

                <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-5">
                  {STATUS_SEQUENCE.map((step, index) => {
                    const active = currentStep >= index;
                    return (
                      <div key={step} className="relative">
                        <div
                          className={`h-2 rounded-full ${active ? "bg-primary-600" : "bg-gray-200"}`}
                          aria-label={`${STATUS_LABELS[step]} ${active ? "completed" : "pending"}`}
                        />
                        <p className={`mt-2 text-[11px] font-semibold ${active ? "text-primary-700" : "text-gray-500"}`}>
                          {STATUS_LABELS[step]}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </section>

              <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <article className="rounded-2xl border border-gray-200 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Delivery</p>
                  <p className="mt-2 inline-flex items-start gap-2 text-sm text-gray-700">
                    <FiMapPin className="mt-0.5" />
                    <span>
                      {order.addressLine1}, {order.city}
                    </span>
                  </p>
                  <p className="mt-2 text-sm text-gray-600">Logistics: {order.logisticsPartner || "Eterna Dispatch"}</p>
                </article>

                <article className="rounded-2xl border border-gray-200 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Rider</p>
                  <p className="mt-2 inline-flex items-center gap-2 text-sm text-gray-700">
                    <FiTruck /> {order.riderName || "Pending assignment"}
                  </p>
                  <p className="mt-2 inline-flex items-center gap-2 text-sm text-gray-700">
                    <FiPhone /> {order.riderPhone || "Not available yet"}
                  </p>
                </article>
              </section>

              <section className="rounded-2xl border border-gray-200 p-4 sm:p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Order Summary</p>
                <div className="mt-4 space-y-2">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between gap-3 text-sm">
                      <p className="text-gray-700">
                        {item.productName} <span className="text-gray-500">x{item.quantity}</span>
                      </p>
                      <p className="font-semibold text-gray-900">KES {item.lineTotal.toLocaleString()}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-4 border-t border-gray-200 pt-3 text-sm">
                  <div className="flex items-center justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>KES {order.subtotal.toLocaleString()}</span>
                  </div>
                  <div className="mt-1 flex items-center justify-between text-gray-600">
                    <span>Shipping</span>
                    <span>KES {order.shippingFee.toLocaleString()}</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-base font-bold text-gray-900">
                    <span>Total</span>
                    <span>KES {order.total.toLocaleString()}</span>
                  </div>
                </div>
              </section>
            </div>
          ) : null}
        </div>
      </div>
    </main>
  );
}
