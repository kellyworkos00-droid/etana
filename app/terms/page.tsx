import StaticPageLayout from "@/components/StaticPageLayout";

export default function TermsPage() {
  return (
    <StaticPageLayout
      title="Terms & Conditions"
      subtitle="Please review the terms that govern purchases and use of this platform."
    >
      <div className="space-y-4 text-sm leading-relaxed text-gray-600">
        <section className="rounded-xl border border-gray-200 p-4">
          <h2 className="font-semibold text-gray-900">1. Orders and Pricing</h2>
          <p className="mt-2">
            By placing an order with Eterna, you agree to listed wholesale pricing, minimum order quantities,
            and stock-based availability at the time of confirmation.
          </p>
        </section>

        <section className="rounded-xl border border-gray-200 p-4">
          <h2 className="font-semibold text-gray-900">2. Payment and Delivery</h2>
          <p className="mt-2">
            Orders are processed upon payment confirmation or approved account terms. Delivery timelines are
            estimated and may vary due to regional logistics and order volume.
          </p>
        </section>

        <section className="rounded-xl border border-gray-200 p-4">
          <h2 className="font-semibold text-gray-900">3. Updates and Compliance</h2>
          <p className="mt-2">
            We reserve the right to update these terms to reflect regulatory requirements, operational needs,
            and product supply conditions.
          </p>
        </section>
      </div>
    </StaticPageLayout>
  );
}
