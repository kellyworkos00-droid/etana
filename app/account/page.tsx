import StaticPageLayout from "@/components/StaticPageLayout";
import Link from "next/link";
import { FiArrowRight, FiCreditCard, FiMapPin, FiPackage, FiUser } from "react-icons/fi";

export default function AccountPage() {
  return (
    <StaticPageLayout
      title="Account Center"
      subtitle="Sign in to continue, then manage your profile, delivery addresses, and wholesale orders from one place."
    >
      <div className="grid gap-6 lg:grid-cols-[1.05fr_1fr]">
        <div className="rounded-2xl border border-rose-100 bg-rose-50/30 p-5 sm:p-6">
          <h2 className="text-xl font-semibold text-gray-900">Sign In</h2>
          <p className="mt-2 text-sm text-gray-600">Use your business account details to access invoices and order updates.</p>

          <form className="mt-5 space-y-4">
            <label className="block text-sm text-gray-700">
              Email
              <input
                className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 outline-none ring-primary-200 transition focus:ring"
                placeholder="you@company.com"
              />
            </label>
            <label className="block text-sm text-gray-700">
              Password
              <input
                type="password"
                className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 outline-none ring-primary-200 transition focus:ring"
                placeholder="********"
              />
            </label>
            <button
              type="button"
              className="w-full rounded-lg bg-primary-600 px-4 py-3 font-semibold text-white transition hover:bg-primary-700"
            >
              Continue to Dashboard
            </button>
          </form>

          <p className="mt-4 text-sm text-gray-600">
            New customer?{" "}
            <Link href="/contact" className="font-semibold text-primary-700 transition hover:text-primary-800">
              Request an account
            </Link>
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">Quick Access</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <Link
              href="/profile"
              className="group rounded-2xl border border-rose-100 bg-white p-4 transition hover:-translate-y-0.5 hover:border-primary-200 hover:shadow-sm"
            >
              <FiUser className="text-xl text-primary-700" />
              <h3 className="mt-3 font-semibold text-gray-900">Profile</h3>
              <p className="mt-1 text-sm text-gray-600">Update contact details and business info.</p>
            </Link>

            <Link
              href="/products"
              className="group rounded-2xl border border-rose-100 bg-white p-4 transition hover:-translate-y-0.5 hover:border-primary-200 hover:shadow-sm"
            >
              <FiPackage className="text-xl text-primary-700" />
              <h3 className="mt-3 font-semibold text-gray-900">Recent Orders</h3>
              <p className="mt-1 text-sm text-gray-600">Review product history and reorder quickly.</p>
            </Link>

            <Link
              href="/shipping"
              className="group rounded-2xl border border-rose-100 bg-white p-4 transition hover:-translate-y-0.5 hover:border-primary-200 hover:shadow-sm"
            >
              <FiMapPin className="text-xl text-primary-700" />
              <h3 className="mt-3 font-semibold text-gray-900">Addresses</h3>
              <p className="mt-1 text-sm text-gray-600">Manage delivery locations for your team.</p>
            </Link>

            <Link
              href="/terms"
              className="group rounded-2xl border border-rose-100 bg-white p-4 transition hover:-translate-y-0.5 hover:border-primary-200 hover:shadow-sm"
            >
              <FiCreditCard className="text-xl text-primary-700" />
              <h3 className="mt-3 font-semibold text-gray-900">Billing Terms</h3>
              <p className="mt-1 text-sm text-gray-600">Check account terms and invoicing policies.</p>
            </Link>
          </div>

          <Link
            href="/profile"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary-700 transition hover:text-primary-800"
          >
            Go to full profile <FiArrowRight />
          </Link>
        </div>
      </div>
    </StaticPageLayout>
  );
}