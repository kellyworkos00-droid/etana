import StaticPageLayout from "@/components/StaticPageLayout";

export default function ShippingPage() {
  return (
    <StaticPageLayout
      title="Shipping Information"
      subtitle="How we dispatch and deliver your bulk orders across Kenya."
    >
      <div className="grid gap-5 md:grid-cols-3">
        <article className="rounded-xl border border-gray-200 bg-gray-50 p-4">
          <h2 className="text-lg font-semibold text-gray-900">Processing Time</h2>
          <p className="mt-2 text-sm text-gray-600">Orders are processed within 4-24 hours after payment confirmation.</p>
        </article>
        <article className="rounded-xl border border-gray-200 bg-gray-50 p-4">
          <h2 className="text-lg font-semibold text-gray-900">Delivery Window</h2>
          <p className="mt-2 text-sm text-gray-600">Most deliveries arrive in 1-3 business days depending on your county.</p>
        </article>
        <article className="rounded-xl border border-gray-200 bg-gray-50 p-4">
          <h2 className="text-lg font-semibold text-gray-900">Tracking Updates</h2>
          <p className="mt-2 text-sm text-gray-600">Dispatch and driver updates are shared via phone call or email.</p>
        </article>
      </div>

      <ul className="mt-5 list-disc space-y-2 pl-5 text-sm text-gray-600">
        <li>Dispatch begins once payment or approved terms are confirmed.</li>
        <li>Large-volume orders may be split into multiple shipments.</li>
        <li>Delivery charges are calculated by zone and order weight.</li>
        <li>Same-day priority dispatch is available for selected products.</li>
      </ul>
    </StaticPageLayout>
  );
}
