import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FiArrowLeft, FiCheckCircle, FiPackage, FiShield, FiTruck } from "react-icons/fi";
import { getProductById, products } from "@/lib/products";

type ProductPageProps = {
  params: {
    id: string;
  };
};

export function generateStaticParams() {
  return products.map((product) => ({ id: String(product.id) }));
}

export default function ProductDetailsPage({ params }: ProductPageProps) {
  const productId = Number(params.id);
  const product = getProductById(productId);

  if (!product) {
    notFound();
  }

  const currentProduct = product as (typeof products)[number];

  const similarProducts = products
    .filter((item) => item.category === currentProduct.category && item.id !== currentProduct.id)
    .slice(0, 3);

  const savePerUnit = currentProduct.price - currentProduct.bulkPrice;
  const minOrderSavings = savePerUnit * currentProduct.minOrder;

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-rose-50/35 px-4 pb-24 pt-28 md:pb-10">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/products"
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-rose-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:border-primary-300 hover:text-primary-700"
        >
          <FiArrowLeft /> Back to products
        </Link>

        <section className="grid gap-6 rounded-3xl border border-rose-100 bg-white p-4 shadow-sm sm:p-6 lg:grid-cols-[1fr_1fr] lg:gap-8 lg:p-8">
          <div className="relative overflow-hidden rounded-2xl bg-gray-100">
            <div className="absolute left-3 top-3 z-10 rounded-full bg-primary-600 px-3 py-1 text-xs font-bold text-white">
              -{currentProduct.discount}%
            </div>
            <Image
              src={currentProduct.image}
              alt={currentProduct.name}
              width={900}
              height={760}
              className="h-full w-full object-cover"
              priority
            />
          </div>

          <div>
            <p className="inline-flex rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-primary-700">
              {currentProduct.category}
            </p>
            <h1 className="mt-3 font-display text-3xl text-gray-900 sm:text-4xl">{currentProduct.name}</h1>

            <div className="mt-5 rounded-2xl border border-rose-100 bg-rose-50/40 p-4">
              <p className="text-sm text-gray-600">Wholesale Price</p>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-3xl font-bold text-primary-700">KES {currentProduct.bulkPrice.toLocaleString()}</span>
                <span className="text-sm text-gray-500 line-through">KES {currentProduct.price.toLocaleString()}</span>
              </div>
              <p className="mt-1 text-xs text-gray-600">
                Save KES {savePerUnit.toLocaleString()} per unit, up to KES {minOrderSavings.toLocaleString()} on minimum order.
              </p>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-gray-200 bg-white p-3">
                <p className="text-xs text-gray-500">Minimum order</p>
                <p className="text-lg font-semibold text-gray-900">{currentProduct.minOrder} units</p>
              </div>
              <div className="rounded-xl border border-gray-200 bg-white p-3">
                <p className="text-xs text-gray-500">Fulfillment window</p>
                <p className="text-lg font-semibold text-gray-900">24-48 hours</p>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/quote"
                className="inline-flex items-center rounded-xl bg-primary-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-700"
              >
                Request Quote
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center rounded-xl border border-gray-300 px-5 py-3 text-sm font-semibold text-gray-700 transition hover:border-primary-300 hover:text-primary-700"
              >
                Talk to Sales
              </Link>
            </div>

            <ul className="mt-6 space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <FiCheckCircle className="text-primary-700" /> Wholesale-grade quality checks
              </li>
              <li className="flex items-center gap-2">
                <FiTruck className="text-primary-700" /> Nationwide delivery options
              </li>
              <li className="flex items-center gap-2">
                <FiShield className="text-primary-700" /> Trusted supplier network
              </li>
              <li className="flex items-center gap-2">
                <FiPackage className="text-primary-700" /> Secure bulk packaging
              </li>
            </ul>
          </div>
        </section>

        <section className="mt-10">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-gray-900">Related Products</h2>
            <Link href="/products" className="text-sm font-semibold text-primary-700 transition hover:text-primary-800">
              View all
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {similarProducts.map((item) => (
              <article key={item.id} className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                <div className="relative h-44">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <p className="text-xs uppercase tracking-wide text-gray-500">{item.category}</p>
                  <h3 className="mt-1 font-semibold text-gray-900">{item.name}</h3>
                  <p className="mt-2 text-sm font-bold text-primary-700">KES {item.bulkPrice.toLocaleString()}</p>
                  <Link
                    href={`/products/${item.id}`}
                    className="mt-3 inline-flex text-sm font-semibold text-primary-700 transition hover:text-primary-800"
                  >
                    View details
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
