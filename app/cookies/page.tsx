import StaticPageLayout from "@/components/StaticPageLayout";

export default function CookiesPage() {
  return (
    <StaticPageLayout
      title="Cookies Policy"
      subtitle="How we use cookies and similar technologies to improve your browsing and order experience."
    >
      <div className="space-y-4 text-sm leading-relaxed text-gray-600">
        <section className="rounded-xl border border-gray-200 p-4">
          <h2 className="font-semibold text-gray-900">Essential Cookies</h2>
          <p className="mt-2">
            Required for core functionality such as cart persistence, authentication state, and security.
          </p>
        </section>

        <section className="rounded-xl border border-gray-200 p-4">
          <h2 className="font-semibold text-gray-900">Performance Cookies</h2>
          <p className="mt-2">
            Help us understand page usage and improve loading speed, search flow, and product discovery.
          </p>
        </section>

        <section className="rounded-xl border border-gray-200 p-4">
          <h2 className="font-semibold text-gray-900">Managing Cookies</h2>
          <p className="mt-2">
            You can manage or delete cookies in your browser settings. Disabling essential cookies may affect
            parts of checkout and account features.
          </p>
        </section>
      </div>
    </StaticPageLayout>
  );
}
