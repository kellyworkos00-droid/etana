import { FiTruck, FiShield, FiDollarSign, FiAward, FiHeadphones, FiPackage } from "react-icons/fi";

const features = [
  {
    id: 1,
    icon: FiTruck,
    title: "Free Bulk Delivery",
    description: "Free delivery on all orders above KES 50,000 across Kenya. Fast and reliable shipping.",
    color: "text-blue-500",
    bgColor: "bg-blue-100",
  },
  {
    id: 2,
    icon: FiDollarSign,
    title: "Best Wholesale Prices",
    description: "Get the best prices in the market for bulk orders. Save more as you order more.",
    color: "text-green-500",
    bgColor: "bg-green-100",
  },
  {
    id: 3,
    icon: FiShield,
    title: "Quality Guaranteed",
    description: "All products are verified for quality. 100% satisfaction guarantee or money back.",
    color: "text-purple-500",
    bgColor: "bg-purple-100",
  },
  {
    id: 4,
    icon: FiAward,
    title: "Trusted by 500+ Businesses",
    description: "Join hundreds of businesses across Kenya who trust us for their bulk orders.",
    color: "text-yellow-500",
    bgColor: "bg-yellow-100",
  },
  {
    id: 5,
    icon: FiHeadphones,
    title: "24/7 Customer Support",
    description: "Our dedicated team is always ready to assist you with your orders and queries.",
    color: "text-red-500",
    bgColor: "bg-red-100",
  },
  {
    id: 6,
    icon: FiPackage,
    title: "Easy Order Management",
    description: "Simple ordering process with flexible payment options and order tracking.",
    color: "text-indigo-500",
    bgColor: "bg-indigo-100",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="relative overflow-hidden py-20 bg-[linear-gradient(to_bottom,#fff7ed,#ffffff)]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-12 -left-14 h-52 w-52 rounded-full bg-amber-200/35 blur-3xl" />
        <div className="absolute -bottom-20 right-0 h-64 w-64 rounded-full bg-rose-200/30 blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="font-display text-3xl md:text-5xl text-gray-900 mb-4">
            Why Choose Eterna?
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
            We are built for high-frequency purchasing teams: reliable pricing, dependable delivery,
            and support that scales with your demand.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.id}
                className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl"
              >
                <div
                  className={`${feature.bgColor} mb-4 flex h-14 w-14 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}
                >
                  <Icon className={`text-3xl ${feature.color}`} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-16 rounded-3xl border border-gray-200 bg-white p-8 shadow-xl shadow-amber-100/40">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="font-display text-4xl md:text-5xl text-primary-700 mb-2">500+</div>
              <div className="text-gray-600 text-sm uppercase tracking-wider">Happy Clients</div>
            </div>
            <div>
              <div className="font-display text-4xl md:text-5xl text-primary-700 mb-2">2000+</div>
              <div className="text-gray-600 text-sm uppercase tracking-wider">Products</div>
            </div>
            <div>
              <div className="font-display text-4xl md:text-5xl text-primary-700 mb-2">47</div>
              <div className="text-gray-600 text-sm uppercase tracking-wider">Counties Served</div>
            </div>
            <div>
              <div className="font-display text-4xl md:text-5xl text-primary-700 mb-2">99%</div>
              <div className="text-gray-600 text-sm uppercase tracking-wider">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
