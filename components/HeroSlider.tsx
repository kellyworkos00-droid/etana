"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import Link from "next/link";
import { FiArrowRight, FiShield, FiTruck } from "react-icons/fi";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

const slides = [
  {
    id: 1,
    title: "Bulk Orders Made Simple",
    subtitle: "Quality Products at Wholesale Prices",
    description: "Order in bulk and save more. Perfect for businesses across Kenya.",
    cta: "Shop Now",
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1920&q=80",
    link: "/products",
  },
  {
    id: 2,
    title: "Fast & Reliable Delivery",
    subtitle: "Serving All of Kenya",
    description: "Free delivery on orders above KES 50,000. Get your products on time, every time.",
    cta: "Get Quote",
    image: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=1920&q=80",
    link: "/quote",
  },
  {
    id: 3,
    title: "Premium Quality Guaranteed",
    subtitle: "Trusted by 500+ Businesses",
    description: "We source only the best products for your business needs.",
    cta: "Explore Categories",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&q=80",
    link: "/categories",
  },
];

export default function HeroSlider() {
  return (
    <section className="relative h-[560px] md:h-[680px] overflow-hidden border-b border-rose-100">
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
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="relative w-full h-full">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${slide.image})` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-900/65 to-rose-950/50" />
              </div>

              <div className="pointer-events-none absolute right-12 top-20 hidden xl:block h-72 w-72 rounded-full border border-rose-200/35 bg-rose-500/10 backdrop-blur-sm" />

              <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
                <div className="max-w-3xl text-white animate-fade-in">
                  <h2 className="mb-3 inline-flex rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-sm font-semibold uppercase tracking-wider text-rose-200">
                    {slide.subtitle}
                  </h2>

                  <h1 className="font-display text-4xl md:text-6xl lg:text-7xl mb-5 leading-tight text-balance animate-rise">
                    {slide.title}
                  </h1>

                  <p className="text-lg md:text-xl mb-8 text-gray-100/90 max-w-2xl leading-relaxed">
                    {slide.description}
                  </p>

                  <div className="flex flex-wrap gap-3 md:gap-4">
                    <Link
                      href={slide.link}
                      className="inline-flex items-center gap-2 rounded-lg bg-primary-500 px-7 py-3 font-semibold text-white transition hover:bg-primary-400"
                    >
                      {slide.cta} <FiArrowRight />
                    </Link>
                    <Link
                      href="/contact"
                      className="inline-flex items-center rounded-lg border border-white/70 px-7 py-3 font-semibold text-white transition hover:bg-white hover:text-rose-900"
                    >
                      Contact Us
                    </Link>
                  </div>

                  <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl">
                    <div className="rounded-xl border border-white/20 bg-white/10 p-3 backdrop-blur-sm">
                      <p className="flex items-center gap-2 text-sm text-rose-100 font-semibold">
                        <FiTruck /> Fast delivery lane
                      </p>
                      <p className="text-sm text-white/90 mt-1">Nationwide dispatch within 24-48 hours.</p>
                    </div>
                    <div className="rounded-xl border border-white/20 bg-white/10 p-3 backdrop-blur-sm">
                      <p className="flex items-center gap-2 text-sm text-rose-100 font-semibold">
                        <FiShield /> Verified wholesale quality
                      </p>
                      <p className="text-sm text-white/90 mt-1">Procurement-ready standards on every order.</p>
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
