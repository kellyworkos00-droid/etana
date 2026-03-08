import Image from "next/image";
import Link from "next/link";
import { FiArrowLeft, FiSearch, FiShoppingBag } from "react-icons/fi";

export default function NotFound() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_right,_rgba(225,29,72,0.16),_transparent_40%),linear-gradient(160deg,#ffffff,#fff1f2)] px-4 py-24">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-80px] top-24 h-64 w-64 rounded-full bg-rose-200/60 blur-3xl" />
        <div className="absolute bottom-8 right-[-60px] h-56 w-56 rounded-full bg-orange-200/40 blur-3xl" />
      </div>

      <section className="relative mx-auto flex w-full max-w-5xl flex-col items-center rounded-3xl border border-white/60 bg-white/80 p-8 text-center shadow-2xl backdrop-blur-md md:p-12">
        <span className="mb-3 inline-flex rounded-full border border-rose-200 bg-rose-50 px-4 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-primary-700">
          Error 404
        </span>

        <Image
          src="/logo.png"
          alt="Eterna logo"
          width={220}
          height={90}
          className="mb-4 h-auto w-[170px] md:w-[220px]"
          priority
        />

        <h1 className="font-display text-balance text-4xl text-gray-900 md:text-6xl">Page Not Found</h1>

        <p className="mt-4 max-w-2xl text-balance text-base text-gray-600 md:text-lg">
          Looks like this page took a different route. Let&apos;s get you back to top wholesale picks
          and active deals.
        </p>

        <div className="mt-8 flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary-600 px-6 py-3 font-semibold text-white transition hover:bg-primary-700"
          >
            <FiArrowLeft /> Back Home
          </Link>
          <Link
            href="/products"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-rose-200 bg-white px-6 py-3 font-semibold text-gray-700 transition hover:border-primary-400 hover:text-primary-700"
          >
            <FiShoppingBag /> Browse Products
          </Link>
          <Link
            href="/categories"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-rose-200 bg-white px-6 py-3 font-semibold text-gray-700 transition hover:border-primary-400 hover:text-primary-700"
          >
            <FiSearch /> Explore Categories
          </Link>
        </div>
      </section>
    </main>
  );
}
