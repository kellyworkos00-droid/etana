import StaticPageLayout from "@/components/StaticPageLayout";

export default function ProfilePage() {
  return (
    <StaticPageLayout
      title="My Profile"
      subtitle="Keep your account information up to date for faster quotes, approvals, and deliveries."
    >
      <div className="grid gap-5 lg:grid-cols-2">
        <section className="rounded-2xl border border-rose-100 p-5">
          <h2 className="text-lg font-semibold text-gray-900">Business Details</h2>
          <div className="mt-4 grid gap-3">
            <label className="text-sm text-gray-700">
              Business name
              <input
                defaultValue="Eterna Wholesale Ltd"
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none ring-primary-200 transition focus:ring"
              />
            </label>
            <label className="text-sm text-gray-700">
              Contact email
              <input
                defaultValue="info@eterna.co.ke"
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none ring-primary-200 transition focus:ring"
              />
            </label>
            <label className="text-sm text-gray-700">
              Phone number
              <input
                defaultValue="+254 118 407 660"
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none ring-primary-200 transition focus:ring"
              />
            </label>
          </div>
        </section>

        <section className="rounded-2xl border border-rose-100 p-5">
          <h2 className="text-lg font-semibold text-gray-900">Primary Address</h2>
          <div className="mt-4 grid gap-3">
            <label className="text-sm text-gray-700">
              Street address
              <input
                defaultValue="123 Business District"
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none ring-primary-200 transition focus:ring"
              />
            </label>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="text-sm text-gray-700">
                City
                <input
                  defaultValue="Nairobi"
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none ring-primary-200 transition focus:ring"
                />
              </label>
              <label className="text-sm text-gray-700">
                Postal code
                <input
                  defaultValue="00100"
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none ring-primary-200 transition focus:ring"
                />
              </label>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-rose-100 p-5 lg:col-span-2">
          <h2 className="text-lg font-semibold text-gray-900">Preferences</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <label className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700">
              <input type="checkbox" defaultChecked className="accent-primary-600" />
              Email order updates
            </label>
            <label className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700">
              <input type="checkbox" defaultChecked className="accent-primary-600" />
              WhatsApp notifications
            </label>
            <label className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700">
              <input type="checkbox" className="accent-primary-600" />
              Product alerts
            </label>
          </div>
        </section>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <button className="rounded-lg bg-primary-600 px-5 py-2.5 font-semibold text-white transition hover:bg-primary-700">
          Save Changes
        </button>
        <button className="rounded-lg border border-gray-300 px-5 py-2.5 font-semibold text-gray-700 transition hover:border-primary-300 hover:text-primary-700">
          Cancel
        </button>
      </div>
    </StaticPageLayout>
  );
}
