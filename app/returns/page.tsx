import StaticPageLayout from "@/components/StaticPageLayout";

export default function ReturnsPage() {
  return (
    <StaticPageLayout
      title="Returns Policy"
      subtitle="Simple and fair return process for eligible products."
    >
      <div className="grid gap-4 md:grid-cols-2">
        <article className="rounded-xl border border-gray-200 p-4">
          <h2 className="font-semibold text-gray-900">Eligible Returns</h2>
          <p className="mt-2 text-sm text-gray-600">
            Incorrect items, damaged goods, or quality issues reported within 48 hours of delivery.
          </p>
        </article>
        <article className="rounded-xl border border-gray-200 p-4">
          <h2 className="font-semibold text-gray-900">Refund Timeline</h2>
          <p className="mt-2 text-sm text-gray-600">
            Approved refunds are processed in 3-7 business days to the original payment method.
          </p>
        </article>
      </div>

      <ul className="mt-5 list-disc space-y-2 pl-5 text-sm text-gray-600">
        <li>Items must remain sealed and in original condition where applicable.</li>
        <li>Damaged or incorrect deliveries are prioritized for replacement.</li>
        <li>Perishable products are reviewed on a case-by-case basis.</li>
        <li>Bulk custom orders may have limited return eligibility.</li>
      </ul>
    </StaticPageLayout>
  );
}
