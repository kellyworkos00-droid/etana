import StaticPageLayout from "@/components/StaticPageLayout";

export default function ReturnsPage() {
  return (
    <StaticPageLayout
      title="Returns Policy"
      subtitle="Simple and fair return process for eligible products."
    >
      <ul className="list-disc space-y-2 pl-5 text-sm text-gray-600">
        <li>Return requests must be made within 48 hours of delivery.</li>
        <li>Items must remain sealed and in original condition where applicable.</li>
        <li>Damaged or incorrect deliveries are prioritized for replacement.</li>
        <li>Approved refunds are processed to the original payment method.</li>
      </ul>
    </StaticPageLayout>
  );
}
