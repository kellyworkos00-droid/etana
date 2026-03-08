import StaticPageLayout from "@/components/StaticPageLayout";

export default function AccountPage() {
  return (
    <StaticPageLayout
      title="Your Account"
      subtitle="Sign in to track orders, manage addresses, and view invoice history."
    >
      <div className="mx-auto max-w-md space-y-4">
        <label className="block text-sm text-gray-700">
          Email
          <input className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5" placeholder="you@company.com" />
        </label>
        <label className="block text-sm text-gray-700">
          Password
          <input type="password" className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5" />
        </label>
        <button
          type="button"
          className="w-full rounded-lg bg-primary-600 px-4 py-3 font-semibold text-white transition hover:bg-primary-700"
        >
          Sign In
        </button>
      </div>
    </StaticPageLayout>
  );
}