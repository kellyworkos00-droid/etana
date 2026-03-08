import StaticPageLayout from "@/components/StaticPageLayout";

export default function FAQPage() {
  return (
    <StaticPageLayout
      title="Frequently Asked Questions"
      subtitle="Quick answers to common questions about bulk ordering, payment, and delivery."
    >
      <div className="space-y-4">
        <article className="rounded-xl border border-gray-200 p-4">
          <h2 className="font-semibold text-gray-900">What is the minimum order quantity?</h2>
          <p className="mt-2 text-sm text-gray-600">Minimum order depends on product category and is listed on each product card.</p>
        </article>
        <article className="rounded-xl border border-gray-200 p-4">
          <h2 className="font-semibold text-gray-900">How long does delivery take?</h2>
          <p className="mt-2 text-sm text-gray-600">Most orders are delivered within 24-72 hours depending on destination.</p>
        </article>
        <article className="rounded-xl border border-gray-200 p-4">
          <h2 className="font-semibold text-gray-900">Do you offer account terms?</h2>
          <p className="mt-2 text-sm text-gray-600">Yes, verified business customers can request account-based invoicing terms.</p>
        </article>
      </div>
    </StaticPageLayout>
  );
}
