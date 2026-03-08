import StaticPageLayout from "@/components/StaticPageLayout";

export default function ContactPage() {
  return (
    <StaticPageLayout
      title="Contact Us"
      subtitle="Tell us what you need and our team will get back to you with pricing and delivery options."
    >
      <div className="grid gap-6 lg:grid-cols-3">
        <section className="space-y-3 lg:col-span-1">
          <article className="rounded-xl border border-gray-200 bg-gray-50 p-4">
            <h2 className="font-semibold text-gray-900">Call Us</h2>
            <p className="mt-1 text-sm text-gray-600">+254 700 000 000</p>
          </article>
          <article className="rounded-xl border border-gray-200 bg-gray-50 p-4">
            <h2 className="font-semibold text-gray-900">Email</h2>
            <p className="mt-1 text-sm text-gray-600">info@eterna.co.ke</p>
          </article>
          <article className="rounded-xl border border-gray-200 bg-gray-50 p-4">
            <h2 className="font-semibold text-gray-900">Hours</h2>
            <p className="mt-1 text-sm text-gray-600">Mon - Fri: 8:00 AM - 6:00 PM</p>
            <p className="text-sm text-gray-600">Sat: 9:00 AM - 3:00 PM</p>
          </article>
        </section>

        <form className="grid gap-4 md:grid-cols-2 lg:col-span-2">
          <label className="text-sm text-gray-700">
            Full Name
            <input className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5" placeholder="Your name" />
          </label>
          <label className="text-sm text-gray-700">
            Business Email
            <input className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5" placeholder="you@company.com" />
          </label>
          <label className="text-sm text-gray-700">
            Phone
            <input className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5" placeholder="+254 ..." />
          </label>
          <label className="text-sm text-gray-700">
            Subject
            <input className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5" placeholder="Bulk quote inquiry" />
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
      </div>
    </StaticPageLayout>
  );
}
