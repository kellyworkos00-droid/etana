import Link from "next/link";

const adminUrl = process.env.NEXT_PUBLIC_ADMIN_URL?.trim();

export default function AdminBridgePage() {
  return (
    <main className="mx-auto flex min-h-[70vh] w-full max-w-3xl flex-col items-center justify-center px-4 text-center">
      <p className="rounded-full bg-red-100 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-red-700">
        Eterna Admin
      </p>
      <h1 className="mt-4 text-3xl font-extrabold text-gray-900">Admin Panel Is Hosted Separately</h1>
      <p className="mt-2 max-w-xl text-gray-600">
        You are on the storefront app. Use the dedicated admin app to manage products and orders.
      </p>

      {adminUrl ? (
        <Link
          href={adminUrl}
          className="mt-6 inline-flex rounded-xl bg-red-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-800"
        >
          Open Admin App
        </Link>
      ) : (
        <p className="mt-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Set NEXT_PUBLIC_ADMIN_URL in your storefront environment to enable one-click access to admin.
        </p>
      )}
    </main>
  );
}
