import Link from "next/link";
import { FiMail, FiPhone, FiMapPin, FiFacebook, FiTwitter, FiInstagram, FiLinkedin } from "react-icons/fi";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-rose-100 bg-white text-gray-600">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-16 left-10 h-52 w-52 rounded-full bg-rose-200/30 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-56 w-56 rounded-full bg-orange-200/20 blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <img
              src="/logo.png"
              alt="Eterna logo"
              className="mb-4 h-16 w-auto object-contain"
            />
            <p className="mb-4 text-slate-300/90 leading-relaxed">
              Kenya's trusted partner for bulk orders. Quality products at wholesale prices with
              reliable delivery across the country.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="rounded-full border border-gray-200 p-2 transition hover:border-primary-300 hover:text-primary-700">
                <FiFacebook className="text-xl" />
              </a>
              <a href="#" className="rounded-full border border-gray-200 p-2 transition hover:border-primary-300 hover:text-primary-700">
                <FiTwitter className="text-xl" />
              </a>
              <a href="#" className="rounded-full border border-gray-200 p-2 transition hover:border-primary-300 hover:text-primary-700">
                <FiInstagram className="text-xl" />
              </a>
              <a href="#" className="rounded-full border border-gray-200 p-2 transition hover:border-primary-300 hover:text-primary-700">
                <FiLinkedin className="text-xl" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-gray-900 text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="transition hover:text-primary-700">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/products" className="transition hover:text-primary-700">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/categories" className="transition hover:text-primary-700">
                  Categories
                </Link>
              </li>
              <li>
                <Link href="/quote" className="transition hover:text-primary-700">
                  Request Quote
                </Link>
              </li>
              <li>
                <Link href="/faq" className="transition hover:text-primary-700">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-gray-900 text-lg font-semibold mb-4">Customer Service</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/shipping" className="transition hover:text-primary-700">
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link href="/returns" className="transition hover:text-primary-700">
                  Returns Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="transition hover:text-primary-700">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="transition hover:text-primary-700">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/contact" className="transition hover:text-primary-700">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-gray-900 text-lg font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start">
                <FiMapPin className="mr-2 mt-1 flex-shrink-0" />
                <span>123 Business District, Nairobi, Kenya</span>
              </li>
              <li className="flex items-center">
                <FiPhone className="mr-2" />
                <a href="tel:+254700000000" className="transition hover:text-primary-700">
                  +254 700 000 000
                </a>
              </li>
              <li className="flex items-center">
                <FiMail className="mr-2" />
                <a href="mailto:info@eterna.co.ke" className="transition hover:text-primary-700">
                  info@eterna.co.ke
                </a>
              </li>
            </ul>
            <div className="mt-4">
              <p className="text-sm font-semibold text-gray-900">Business Hours:</p>
              <p className="text-sm">Mon - Fri: 8:00 AM - 6:00 PM</p>
              <p className="text-sm">Sat: 9:00 AM - 3:00 PM</p>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-200 pt-8 text-center">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Eterna Bulk Orders. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
