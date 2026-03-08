import StaticPageLayout from "@/components/StaticPageLayout";

export default function ShippingPage() {
  return (
    <StaticPageLayout
      title="Shipping Information"
      subtitle="How we dispatch and deliver your bulk orders across Kenya."
    >
      <ul className="list-disc space-y-2 pl-5 text-sm text-gray-600">
        <li>Dispatch begins once payment or approved terms are confirmed.</li>
        <li>Delivery windows vary by county and stock availability.</li>
        <li>Large-volume orders may be split into multiple shipments.</li>
        <li>Tracking updates are shared via phone or email.</li>
      </ul>
    </StaticPageLayout>
  );
}
