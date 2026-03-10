"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { FiArrowRight, FiCheckCircle, FiClock, FiShield, FiTruck } from "react-icons/fi";
import { fetchHomeSlidesFromApi, LIVE_REFRESH_INTERVAL_MS } from "@/lib/store-api";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

const slides = [
  {
    id: 1,
    title: "Wholesale Ordering, Reimagined",
    subtitle: "Built for Fast-Moving Businesses",
    description: "Source trusted products at scale with predictable pricing, quick support, and reliable nationwide delivery.",
    cta: "Browse Products",
    badge: "Popular with retailers",
    stats: ["500+ active business buyers", "24-48 hr dispatch", "KES 50,000 free-delivery threshold"],
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1920&q=80",
    link: "/products",
  },
  {
    id: 2,
    title: "Delivery You Can Plan Around",
    subtitle: "Nationwide Logistics Network",
    description: "From Nairobi to regional hubs, Eterna keeps your stock moving with clear timelines and consistent handoff.",
    cta: "Start Cart",
    badge: "Operations-friendly",
    stats: ["Live order coordination", "Scheduled drop-offs", "Dedicated support line"],
    image: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=1920&q=80",
    link: "/checkout",
  },
  {
    id: 3,
    title: "Quality Standards, Not Guesswork",
    subtitle: "Curated for Consistency",
    description: "Every category is selected for dependable quality so your shelves, kitchens, and teams stay fully supplied.",
    cta: "Explore Categories",
    badge: "Procurement-ready",
    stats: ["Verified supplier chain", "Transparent category mix", "Reliable replenishment"],
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&q=80",
    link: "/categories",
  },
];

type ManagedSlide = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  cta: string;
  badge: string;
  stats: string[];
  image: string;
  link: string;
};

export default function HeroSlider() {
  const [managedSlides, setManagedSlides] = useState<ManagedSlide[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    let mounted = true;

    const syncSlides = async () => {
      const data = await fetchHomeSlidesFromApi();
      if (mounted) {
        setManagedSlides(data as ManagedSlide[]);
      }
    };

    syncSlides();
    const interval = window.setInterval(syncSlides, LIVE_REFRESH_INTERVAL_MS);

    return () => {
      mounted = false;
      window.clearInterval(interval);
    };
  }, []);

  const activeSlides = useMemo(() => {
    return managedSlides.length > 0 ? managedSlides : slides;
  }, [managedSlides]);

  if (!isMounted) {
    return null;
  }

  return (
    <section className="relative overflow-hidden border-b border-rose-100 bg-white pt-24 md:pt-28">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-12 h-72 w-72 rounded-full bg-rose-200/40 blur-3xl" />
        <div className="absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-red-300/25 blur-3xl" />
      </div>

      <Swiper
        modules={[Autoplay, Pagination, EffectFade]}
        effect="fade"
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
          bulletClass: "swiper-pagination-bullet",
          bulletActiveClass: "swiper-pagination-bullet-active",
        }}
        loop={true}
        className="h-full"
      >
        {activeSlides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="relative mx-auto flex min-h-[560px] w-full max-w-7xl items-center px-4 pb-12 sm:px-6 lg:px-8 md:min-h-[650px]">
              <div className="grid w-full gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
                <div className="animate-fade-in rounded-3xl border border-rose-100 bg-white/90 p-6 shadow-xl shadow-rose-100/60 backdrop-blur-sm sm:p-8 lg:p-10">
                  <div className="mb-4 flex flex-wrap items-center gap-3">
                    <span className="inline-flex rounded-full bg-primary-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-primary-700">
                      {slide.subtitle}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full border border-rose-200 px-3 py-1 text-xs font-semibold text-rose-700">
                      <FiCheckCircle /> {slide.badge}
                    </span>
                  </div>

                  <h1 className="font-display text-4xl leading-tight text-gray-900 sm:text-5xl lg:text-6xl">
                    {slide.title}
                  </h1>

                  <p className="mt-5 max-w-2xl text-base leading-relaxed text-gray-600 sm:text-lg">{slide.description}</p>

                  <div className="mt-7 flex flex-wrap gap-3">
                    {(() => {
                      const ctaLink = slide.link === "/quote" ? "/checkout" : slide.link;
                      const ctaLabel = /quote/i.test(slide.cta) ? "Start Cart" : slide.cta;

                      return (
                        <Link
                          href={ctaLink}
                          className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-700"
                        >
                          {ctaLabel} <FiArrowRight />
                        </Link>
                      );
                    })()}
                    <Link
                      href="/contact"
                      className="inline-flex items-center rounded-xl border border-rose-200 px-6 py-3 text-sm font-semibold text-gray-700 transition hover:border-primary-300 hover:text-primary-700"
                    >
                      Talk to Sales
                    </Link>
                  </div>

                  <div className="mt-7 grid gap-2 text-sm text-gray-700 sm:grid-cols-3">
                    {slide.stats.map((item) => (
                      <p key={item} className="rounded-xl border border-rose-100 bg-rose-50/40 px-3 py-2.5">
                        {item}
                      </p>
                    ))}
                  </div>

                  <div className="mt-5 flex flex-wrap gap-3">
                    <p className="inline-flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2 text-xs font-semibold text-gray-600">
                      <FiTruck className="text-primary-700" /> Reliable Logistics
                    </p>
                    <p className="inline-flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2 text-xs font-semibold text-gray-600">
                      <FiShield className="text-primary-700" /> Quality Assured
                    </p>
                    <p className="inline-flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2 text-xs font-semibold text-gray-600">
                      <FiClock className="text-primary-700" /> Fast Response Time
                    </p>
                  </div>
                </div>

                <div className="relative hidden lg:block">
                  <div className="absolute -left-4 -top-4 h-24 w-24 rounded-2xl bg-primary-600/15 blur-xl" />
                  <div className="absolute -bottom-6 -right-4 h-24 w-24 rounded-2xl bg-rose-400/20 blur-xl" />
                  <div className="relative overflow-hidden rounded-3xl border border-rose-200 bg-white p-2 shadow-2xl shadow-rose-100/60">
                    <div
                      className="h-[470px] rounded-[1.35rem] bg-cover bg-center"
                      style={{ backgroundImage: `url(${slide.image})` }}
                    >
                      <div className="flex h-full items-end bg-gradient-to-t from-black/45 via-black/10 to-transparent p-6">
                        <p className="rounded-xl bg-white/85 px-4 py-2 text-sm font-semibold text-gray-900 backdrop-blur-sm">
                          Red and white procurement experience for modern wholesale teams
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
