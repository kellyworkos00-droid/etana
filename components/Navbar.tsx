"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  FiShoppingCart,
  FiSearch,
  FiUser,
  FiChevronDown,
  FiArrowRight,
  FiHome,
  FiGrid,
  FiBox,
} from "react-icons/fi";

const categoryGroups = [
  {
    title: "Food & Beverage",
    items: ["Bulk Grains", "Cooking Oils", "Flour & Sugar", "Beverage Supplies"],
  },
  {
    title: "Home & Business",
    items: ["Cleaning Essentials", "Paper Goods", "Storage", "Facility Products"],
  },
  {
    title: "Health & Beauty",
    items: ["Hygiene Supplies", "Personal Care", "Sanitizers", "Packaging"],
  },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const pathname = usePathname();

  const mobileLinks = [
    { href: "/", label: "Home", icon: FiHome },
    { href: "/products", label: "Products", icon: FiBox },
    { href: "/categories", label: "Categories", icon: FiGrid },
    { href: "/quote", label: "Quote", icon: FiShoppingCart },
    { href: "/account", label: "Account", icon: FiUser },
  ];

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 18);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed left-0 right-0 top-3 z-50 px-3 sm:px-5">
      <nav className="max-w-7xl mx-auto">
        <div
          className={`relative rounded-2xl border transition-all duration-300 ${
            isScrolled
              ? "border-rose-200/80 bg-white/85 shadow-xl backdrop-blur-xl"
              : "border-white/40 bg-white/55 shadow-lg backdrop-blur-md"
          }`}
        >
          <div className="flex h-16 items-center justify-between px-4 sm:px-6">
            <Link href="/" className="flex items-center">
              <img src="/logo.png" alt="Eterna logo" className="h-9 w-auto sm:h-10 object-contain" />
            </Link>

            <div className="hidden md:flex items-center gap-7">
              <Link href="/" className="text-sm font-semibold text-gray-700 transition hover:text-primary-700">
                Home
              </Link>
              <Link
                href="/products"
                className="text-sm font-semibold text-gray-700 transition hover:text-primary-700"
              >
                Products
              </Link>

              <div
                className="relative"
                onMouseEnter={() => setIsMegaMenuOpen(true)}
                onMouseLeave={() => setIsMegaMenuOpen(false)}
              >
                <button
                  onClick={() => setIsMegaMenuOpen((prev) => !prev)}
                  className="inline-flex items-center gap-1 text-sm font-semibold text-gray-700 transition hover:text-primary-700"
                  aria-expanded={isMegaMenuOpen}
                  aria-haspopup="menu"
                >
                  Categories
                  <FiChevronDown
                    className={`transition-transform duration-200 ${isMegaMenuOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {isMegaMenuOpen && (
                  <div className="absolute left-1/2 top-11 w-[680px] -translate-x-1/2 rounded-2xl border border-rose-100 bg-white/95 p-4 shadow-2xl backdrop-blur-xl">
                    <div className="grid grid-cols-3 gap-3">
                      {categoryGroups.map((group) => (
                        <div key={group.title} className="rounded-xl border border-gray-100 bg-gray-50/80 p-3">
                          <p className="mb-2 text-xs font-bold uppercase tracking-[0.12em] text-primary-700">
                            {group.title}
                          </p>
                          <ul className="space-y-2">
                            {group.items.map((item) => (
                              <li key={item}>
                                <Link
                                  href="/categories"
                                  className="text-sm text-gray-600 transition hover:text-primary-700"
                                >
                                  {item}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>

                    <Link
                      href="/categories"
                      className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary-700 transition hover:text-primary-800"
                    >
                      Explore all categories <FiArrowRight />
                    </Link>
                  </div>
                )}
              </div>

              <Link
                href="/about"
                className="text-sm font-semibold text-gray-700 transition hover:text-primary-700"
              >
                About
              </Link>
              <Link
                href="/contact"
                className="text-sm font-semibold text-gray-700 transition hover:text-primary-700"
              >
                Contact
              </Link>
            </div>

            <div className="hidden md:flex items-center gap-2">
              <button
                aria-label="Search"
                className="rounded-lg border border-gray-200 bg-white/80 p-2 text-gray-700 transition hover:border-primary-300 hover:text-primary-700"
              >
                <FiSearch className="text-lg" />
              </button>
              <button
                aria-label="Cart"
                className="relative rounded-lg border border-gray-200 bg-white/80 p-2 text-gray-700 transition hover:border-primary-300 hover:text-primary-700"
              >
                <FiShoppingCart className="text-lg" />
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary-600 text-[10px] text-white">
                  0
                </span>
              </button>
              <button
                aria-label="Account"
                className="rounded-lg border border-gray-200 bg-white/80 p-2 text-gray-700 transition hover:border-primary-300 hover:text-primary-700"
              >
                <FiUser className="text-lg" />
              </button>
              <Link
                href="/quote"
                className="ml-1 rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-700"
              >
                Get Quote
              </Link>
            </div>

            <div className="md:hidden flex items-center gap-2">
              <button
                aria-label="Search"
                className="rounded-md border border-gray-200 bg-white/80 p-2 text-gray-700 transition hover:text-primary-700"
              >
                <FiSearch className="text-lg" />
              </button>
              <button
                aria-label="Cart"
                className="rounded-md border border-gray-200 bg-white/80 p-2 text-gray-700 transition hover:text-primary-700"
              >
                <FiShoppingCart className="text-lg" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="fixed inset-x-0 bottom-4 z-50 px-4 md:hidden">
        <div className="mx-auto flex max-w-sm items-center justify-between rounded-2xl border border-rose-200/70 bg-white/90 px-2 py-2 shadow-2xl backdrop-blur-xl">
          {mobileLinks.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex min-w-[60px] flex-col items-center rounded-xl px-2 py-1.5 transition-all duration-200 active:scale-95 ${
                  isActive
                    ? "bg-primary-50 text-primary-700"
                    : "text-gray-500 hover:-translate-y-0.5 hover:bg-rose-50 hover:text-primary-700"
                }`}
              >
                <Icon className="text-lg" />
                <span className="mt-1 text-[11px] font-semibold">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
}
