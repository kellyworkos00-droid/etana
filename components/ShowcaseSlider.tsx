"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectCoverflow, Pagination, Navigation, Keyboard } from "swiper/modules";
import { FiArrowRight, FiBox, FiChevronLeft, FiChevronRight, FiTrendingUp } from "react-icons/fi";
import { fetchProductsFromApi, fetchSliderOffersFromApi, LIVE_REFRESH_INTERVAL_MS } from "@/lib/store-api";
import type { Product } from "@/lib/products";

import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";

type ShowcaseItem = {
  id: number;
  title: string;
  caption: string;
  metric: string;
  detail: string;
  image: string;
  href: string;
  cta: string;
};

function toOfferSlides(items: Product[]): ShowcaseItem[] {
  return items.slice(0, 6).map((item, index) => ({
    id: index + 1,
    title: item.name,
    caption: `${item.category} Offer`,
    metric: item.discount > 0 ? `Save ${item.discount}%` : "Featured",
    detail: `Bulk from KES ${item.bulkPrice.toLocaleString()} with minimum order ${item.minOrder}.`,
    image: item.image,
    href: `/products/${item.id}`,
    cta: "View Offer",
  }));
}

export default function ShowcaseSlider() {
  const [offerSlides, setOfferSlides] = useState<ShowcaseItem[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    let mounted = true;

    const syncOffers = async () => {
      const sliderManaged = await fetchSliderOffersFromApi();
      if (sliderManaged.length > 0) {
        if (mounted) {
          setOfferSlides(toOfferSlides(sliderManaged));
        }
        return;
      }

      const products = await fetchProductsFromApi();
      const sortedOffers = [...products]
        .sort((a, b) => (b.discount || 0) - (a.discount || 0))
        .filter((item) => item.discount > 0);

      const source = sortedOffers.length > 0 ? sortedOffers : products;
      if (mounted) {
        setOfferSlides(toOfferSlides(source));
      }
    };

    syncOffers();
    const interval = window.setInterval(syncOffers, LIVE_REFRESH_INTERVAL_MS);

    const onVisible = () => {
      if (document.visibilityState === "visible") {
        syncOffers();
      }
    };

    document.addEventListener("visibilitychange", onVisible);

    return () => {
      mounted = false;
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);

  const slides = useMemo(() => {
    return offerSlides;
  }, [offerSlides]);

  if (!isMounted || slides.length === 0) {
    return null;
  }

  return (
    <section className="relative overflow-hidden py-16 sm:py-20">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-16 top-10 h-56 w-56 rounded-full bg-red-200/35 blur-3xl" />
        <div className="absolute right-0 top-24 h-56 w-56 rounded-full bg-rose-200/30 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-white px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-primary-700">
              <FiTrendingUp /> Premium Sliding Showcase
            </p>
            <h2 className="mt-4 font-display text-3xl text-gray-900 sm:text-4xl lg:text-5xl">
              Built To Impress, Designed To Convert
            </h2>
            <p className="mt-3 max-w-2xl text-gray-600">
              A modern red and white carousel section with rich visuals and strong conversion-focused messaging.
            </p>
          </div>

          <Link
            href="/products"
            className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-700"
          >
            See Full Catalog <FiArrowRight />
          </Link>
        </div>

        <Swiper
          modules={[Autoplay, EffectCoverflow, Pagination, Navigation, Keyboard]}
          className="showcase-swiper"
          effect="coverflow"
          centeredSlides
          loop
          grabCursor
          keyboard={{ enabled: true }}
          speed={700}
          slidesPerView={1.08}
          spaceBetween={16}
          navigation={{
            prevEl: ".showcase-slider-prev",
            nextEl: ".showcase-slider-next",
          }}
          coverflowEffect={{
            rotate: 0,
            stretch: 0,
            depth: 120,
            modifier: 1,
            slideShadows: false,
          }}
          autoplay={{ delay: 3200, disableOnInteraction: false, pauseOnMouseEnter: true }}
          pagination={{ clickable: true }}
          breakpoints={{
            640: { slidesPerView: 1.35, spaceBetween: 18 },
            1024: { slidesPerView: 1.85, spaceBetween: 22 },
            1280: { slidesPerView: 2.15, spaceBetween: 24 },
          }}
        >
          {slides.map((item) => (
            <SwiperSlide key={item.id}>
              <article className="group overflow-hidden rounded-3xl border border-rose-100 bg-white shadow-lg shadow-rose-100/60 transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-rose-200/70">
                <div className="relative h-64 sm:h-72">
                  <div
                    className="h-full w-full bg-cover bg-center transition duration-500 group-hover:scale-105"
                    style={{ backgroundImage: `url(${item.image})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-transparent" />

                  <span className="absolute left-4 top-4 inline-flex rounded-full border border-white/45 bg-white/20 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                    {item.metric}
                  </span>

                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <p className="text-xs uppercase tracking-[0.12em] text-rose-100">{item.caption}</p>
                    <h3 className="mt-1 text-2xl font-semibold leading-tight">{item.title}</h3>
                  </div>
                </div>

                <div className="p-5">
                  <p className="text-sm leading-relaxed text-gray-600">{item.detail}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="inline-flex items-center gap-2 rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-primary-700">
                      <FiBox /> Wholesale Ready
                    </span>
                    <Link
                      href={item.href}
                      className="inline-flex items-center gap-1 text-sm font-semibold text-primary-700 transition hover:text-primary-800"
                    >
                      {item.cta} <FiArrowRight />
                    </Link>
                  </div>
                </div>
              </article>
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="mt-5 flex items-center justify-center gap-2">
          <button
            type="button"
            className="showcase-slider-prev slider-nav"
            aria-label="Previous showcase slide"
          >
            <FiChevronLeft />
          </button>
          <button
            type="button"
            className="showcase-slider-next slider-nav"
            aria-label="Next showcase slide"
          >
            <FiChevronRight />
          </button>
        </div>
      </div>
    </section>
  );
}
