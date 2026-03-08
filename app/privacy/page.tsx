import StaticPageLayout from "@/components/StaticPageLayout";

export default function PrivacyPage() {
  return (
    <StaticPageLayout
      title="Privacy Policy"
      subtitle="How we collect, use, and protect your information."
    >
      <p className="text-sm leading-relaxed text-gray-600">
        We collect business contact information and order data only for processing purchases,
        customer support, and service improvement. We do not sell personal data. Access to customer
        information is restricted and safeguarded through technical and operational controls.
      </p>
    </StaticPageLayout>
  );
}