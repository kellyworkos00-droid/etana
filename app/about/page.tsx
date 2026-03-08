import StaticPageLayout from "@/components/StaticPageLayout";

export default function AboutPage() {
  return (
    <StaticPageLayout
      title="About Eterna"
      subtitle="We support businesses with dependable wholesale supply, transparent pricing, and on-time delivery across Kenya."
    >
      <div className="grid gap-6 md:grid-cols-3">
        <article className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
          <h2 className="text-xl font-semibold text-gray-900">Our Mission</h2>
          <p className="mt-2 text-sm leading-relaxed text-gray-600">
            Simplify bulk procurement for every business with quality products and predictable service.
          </p>
        </article>
        <article className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
          <h2 className="text-xl font-semibold text-gray-900">Our Reach</h2>
          <p className="mt-2 text-sm leading-relaxed text-gray-600">
            From Nairobi to all 47 counties, our distribution network helps teams restock faster.
          </p>
        </article>
        <article className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
          <h2 className="text-xl font-semibold text-gray-900">Our Promise</h2>
          <p className="mt-2 text-sm leading-relaxed text-gray-600">
            Fair wholesale rates, verified product quality, and support that responds when you need it.
          </p>
        </article>
      </div>
    </StaticPageLayout>
  );
}
