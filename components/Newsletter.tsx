"use client";
import { useState } from "react";
import { FiMail, FiSend, FiCheckCircle } from "react-icons/fi";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    
    // Simulate API call
    setTimeout(() => {
      setStatus("success");
      setEmail("");
      setTimeout(() => setStatus("idle"), 3000);
    }, 1000);
  };

  return (
    <section className="relative overflow-hidden py-20 bg-slate-950 text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-20 right-1/4 h-64 w-64 rounded-full bg-primary-500/20 blur-3xl" />
        <div className="absolute bottom-0 -left-16 h-64 w-64 rounded-full bg-amber-400/20 blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 rounded-3xl border border-white/10 bg-white/5 p-6 md:grid-cols-2 md:p-10 backdrop-blur-sm">
          <div className="md:pr-4">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/20 bg-white/10">
              <FiMail className="text-3xl text-rose-200" />
            </div>

            <h2 className="font-display text-3xl md:text-4xl mb-4">
              Stay Ahead of Bulk Deals
            </h2>

            <p className="text-slate-200 leading-relaxed mb-6">
              Weekly procurement insights, limited wholesale offers, and priority stock alerts for your business team.
            </p>

            <div className="space-y-2 text-sm text-slate-200">
              <p className="flex items-center gap-2"><FiCheckCircle className="text-rose-300" /> Exclusive buyer-only discounts</p>
              <p className="flex items-center gap-2"><FiCheckCircle className="text-rose-300" /> New product drop notifications</p>
              <p className="flex items-center gap-2"><FiCheckCircle className="text-rose-300" /> Quarterly pricing trend updates</p>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-5 md:p-6">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.14em] text-rose-200">
              Join 5,000+ subscribers
            </p>

            <form onSubmit={handleSubmit}>
              <div className="flex flex-col gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  className="w-full rounded-lg border border-white/15 bg-white px-5 py-3.5 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-400"
                />
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary-500 px-6 py-3.5 font-semibold text-white transition hover:bg-primary-400 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {status === "loading" ? (
                    "Subscribing..."
                  ) : (
                    <>
                      Subscribe Now <FiSend />
                    </>
                  )}
                </button>
              </div>

              {status === "success" && (
                <p className="mt-4 font-medium text-rose-200">
                  Successfully subscribed! Check your email for confirmation.
                </p>
              )}
              {status === "error" && (
                <p className="mt-4 font-medium text-red-200">
                  Something went wrong. Please try again.
                </p>
              )}
            </form>

            <p className="mt-4 text-xs text-slate-300">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
