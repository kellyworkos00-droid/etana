import Link from "next/link";
import StaticPageLayout from "@/components/StaticPageLayout";

export default function QuotePage() {
  return (
    <StaticPageLayout
      title="Request a Quote"
      subtitle="Share your bulk requirements and receive a tailored quote with delivery estimate."
    >
      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-sm text-gray-700">
          Company Name
          <input className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5" placeholder="Business Ltd" />
        </label>
        <label className="text-sm text-gray-700">
          Contact Phone
          <input className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5" placeholder="+254 ..." />
        </label>
        <label className="text-sm text-gray-700 md:col-span-2">
          Products Needed
          <textarea
            className="mt-1 min-h-[130px] w-full rounded-lg border border-gray-300 px-3 py-2.5"
            placeholder="List quantities and preferred delivery date"
          />
        </label>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          className="rounded-lg bg-primary-600 px-5 py-3 font-semibold text-white transition hover:bg-primary-700"
        >
          Submit Quote Request
        </button>
        <Link
          href="/checkout"
          className="rounded-lg border border-gray-300 px-5 py-3 font-semibold text-gray-700 transition hover:border-primary-400 hover:text-primary-700"
        >
          Go to Checkout
        </Link>
      </div>
    </StaticPageLayout>
  );
}
