import type { ReactNode } from "react";

type StaticPageLayoutProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
};

export default function StaticPageLayout({ title, subtitle, children }: StaticPageLayoutProps) {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-rose-50/35 px-4 pb-24 pt-28 md:pb-12">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 text-center md:text-left">
          <h1 className="font-display text-4xl text-gray-900 md:text-5xl">{title}</h1>
          <p className="mx-auto mt-3 max-w-2xl text-gray-600 md:mx-0">{subtitle}</p>
        </header>

        <section className="rounded-3xl border border-rose-100 bg-white p-6 shadow-sm md:p-8">{children}</section>
      </div>
    </main>
  );
}