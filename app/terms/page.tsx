import StaticPageLayout from "@/components/StaticPageLayout";

export default function TermsPage() {
  return (
    <StaticPageLayout
      title="Terms & Conditions"
      subtitle="Please review the terms that govern purchases and use of this platform."
    >
      <p className="text-sm leading-relaxed text-gray-600">
        By placing an order with Eterna, you agree to our pricing terms, product availability conditions,
        and shipping timelines. Bulk pricing may vary due to market supply changes. We reserve the right
        to update these terms to maintain operational and legal compliance.
      </p>
    </StaticPageLayout>
  );
}
