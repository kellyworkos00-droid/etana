import StaticPageLayout from "@/components/StaticPageLayout";

export default function ContactPage() {
  return (
    <StaticPageLayout
      title="Contact Us"
      subtitle="Tell us what you need and our team will get back to you with pricing and delivery options."
    >
      <form className="grid gap-4 md:grid-cols-2">
        <label className="text-sm text-gray-700">
          Full Name
          <input className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5" placeholder="Your name" />
        </label>
        <label className="text-sm text-gray-700">
          Email
          <input className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5" placeholder="you@company.com" />
        </label>
        <label className="text-sm text-gray-700 md:col-span-2">
          Message
          <textarea
            className="mt-1 min-h-[130px] w-full rounded-lg border border-gray-300 px-3 py-2.5"
            placeholder="How can we help?"
          />
        </label>
        <button
          type="button"
          className="md:col-span-2 rounded-lg bg-primary-600 px-4 py-3 font-semibold text-white transition hover:bg-primary-700"
        >
          Send Message
        </button>
      </form>
    </StaticPageLayout>
  );
}
