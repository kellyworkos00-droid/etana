import type { Product } from "@/lib/products";
import { products as staticProducts } from "@/lib/products";

export const LIVE_REFRESH_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes
const PRODUCT_CACHE_TTL_MS = 60 * 1000;

let productCache: { data: Product[]; ts: number } | null = null;

type AdminProduct = {
  id: string;
  name: string;
  slug?: string;
  category: string;
  imageUrl: string;
  price: number;
  bulkPrice: number;
  minOrder: number;
  discountPct: number;
  sizes?: string[];
  sizePrices?: Record<string, number>;
};

type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
};

type SliderProduct = {
  id: string;
  name: string;
  category: string;
  imageUrl: string;
  bulkPrice: number;
  minOrder: number;
  discountPct: number;
};

type HomeSlide = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  cta: string;
  badge: string;
  stats: string[];
  image: string;
  link: string;
  sortOrder: number;
  isActive: boolean;
};

type CreateOrderPayload = {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  addressLine1: string;
  city: string;
  notes?: string;
  paymentMethod: "CARD" | "MPESA" | "BANK" | "COD";
  promoCode?: string;
  items: Array<{ productId: string; quantity: number; selectedSize?: string }>;
};

type PromoValidationResult = {
  code: string;
  discountType: "PERCENT" | "FIXED";
  discountValue: number;
  discountAmount: number;
};

export type BuyerTrackedOrder = {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string | null;
  city: string;
  addressLine1: string;
  paymentMethod: "CARD" | "MPESA" | "BANK" | "COD";
  paymentStatus: "PENDING" | "ESCROW_HELD" | "PAID" | "RELEASED" | "FAILED" | "REFUNDED";
  status: "PENDING" | "PAID" | "CONFIRMED" | "PACKING" | "READY_FOR_PICKUP" | "PICKED_UP" | "ON_DELIVERY" | "DELIVERED" | "CANCELLED";
  subtotal: number;
  shippingFee: number;
  total: number;
  riderName?: string | null;
  riderPhone?: string | null;
  logisticsPartner?: string | null;
  deliveredAt?: string | null;
  createdAt: string;
  updatedAt: string;
  items: Array<{
    id: string;
    productId: string;
    productName: string;
    productImage?: string | null;
    quantity: number;
    unitPrice: number;
    lineTotal: number;
  }>;
};

type FetchProductsOptions = {
  lat?: number;
  lng?: number;
  radiusKm?: number;
  search?: string;
  category?: string;
  sort?: "newest" | "price-low" | "price-high";
};

let browserLocationCache: { lat: number; lng: number; ts: number } | null = null;

function getApiBaseUrl() {
  if (process.env.NEXT_PUBLIC_API_BASE_URL) {
    return process.env.NEXT_PUBLIC_API_BASE_URL;
  }

  return process.env.NODE_ENV === "production"
    ? "https://eterna-admin-jade.vercel.app/api/v1"
    : "http://localhost:3001/api/v1";
}

function hasValidCoordinates(lat: number, lng: number) {
  return Number.isFinite(lat) && Number.isFinite(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
}

async function resolveClientLocation(): Promise<{ lat: number; lng: number } | null> {
  if (typeof window === "undefined" || !window.navigator?.geolocation) {
    return null;
  }

  if (browserLocationCache && Date.now() - browserLocationCache.ts < 10 * 60 * 1000) {
    return { lat: browserLocationCache.lat, lng: browserLocationCache.lng };
  }

  try {
    const position = await new Promise<GeolocationPosition>((resolve, reject) => {
      window.navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: false,
        timeout: 4000,
        maximumAge: 10 * 60 * 1000,
      });
    });

    const lat = position.coords.latitude;
    const lng = position.coords.longitude;
    if (!hasValidCoordinates(lat, lng)) {
      return null;
    }

    browserLocationCache = { lat, lng, ts: Date.now() };
    return { lat, lng };
  } catch {
    return null;
  }
}

function normalizeProduct(item: AdminProduct): Product {
  const sizePrices: Record<string, number> = {};
  for (const [size, value] of Object.entries(item.sizePrices ?? {})) {
    const normalizedSize = String(size).trim();
    const normalizedPrice = Number(value);
    if (normalizedSize && Number.isFinite(normalizedPrice) && normalizedPrice > 0) {
      sizePrices[normalizedSize] = normalizedPrice;
    }
  }

  return {
    id: String(item.id),
    name: item.name,
    category: item.category as Product["category"],
    price: Number(item.price),
    bulkPrice: Number(item.bulkPrice),
    minOrder: Number(item.minOrder),
    image: item.imageUrl,
    discount: Number(item.discountPct ?? 0),
    sizes: Array.isArray(item.sizes) ? item.sizes.map((size) => String(size).trim()).filter(Boolean) : [],
    sizePrices,
  };
}

function extractData<T>(payload: unknown): T | null {
  if (!payload || typeof payload !== "object") {
    return null;
  }
  const root = payload as { data?: unknown };

  if (root.data && typeof root.data === "object" && "data" in (root.data as object)) {
    return (root.data as { data: T }).data;
  }

  return (root.data as T) ?? null;
}

function extractMeta(payload: unknown): PaginationMeta | null {
  if (!payload || typeof payload !== "object") {
    return null;
  }

  const root = payload as { data?: unknown };
  if (!root.data || typeof root.data !== "object") {
    return null;
  }

  const dataRoot = root.data as { meta?: unknown };
  if (!dataRoot.meta || typeof dataRoot.meta !== "object") {
    return null;
  }

  const meta = dataRoot.meta as Partial<PaginationMeta>;
  const page = Number(meta.page);
  const limit = Number(meta.limit);
  const total = Number(meta.total);

  if (!Number.isFinite(page) || !Number.isFinite(limit) || !Number.isFinite(total)) {
    return null;
  }

  return { page, limit, total };
}

export async function fetchProductsFromApi(options: FetchProductsOptions = {}): Promise<Product[]> {
  if (productCache && Date.now() - productCache.ts < PRODUCT_CACHE_TTL_MS) {
    return productCache.data;
  }

  try {
    const pageSize = 100;
    let page = 1;
    let totalPages = 1;
    const allItems: AdminProduct[] = [];

    let lat = options.lat;
    let lng = options.lng;

    if (!hasValidCoordinates(Number(lat), Number(lng))) {
      const browserLocation = await resolveClientLocation();
      if (browserLocation) {
        lat = browserLocation.lat;
        lng = browserLocation.lng;
      }
    }

    while (page <= totalPages) {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(pageSize),
      });

      if (options.search) {
        params.set("search", options.search);
      }
      if (options.category) {
        params.set("category", options.category);
      }
      if (options.sort) {
        params.set("sort", options.sort);
      }
      if (hasValidCoordinates(Number(lat), Number(lng))) {
        params.set("lat", String(lat));
        params.set("lng", String(lng));
        params.set("radiusKm", String(options.radiusKm ?? 25));
      }

      const response = await fetch(`${getApiBaseUrl()}/products?${params.toString()}`, {
        next: { revalidate: 60 }, // revalidate every 60 seconds
      });

      if (!response.ok) {
        break;
      }

      const payload = (await response.json()) as unknown;
      const data = extractData<AdminProduct[]>(payload);
      const meta = extractMeta(payload);

      if (!data || !Array.isArray(data) || data.length === 0) {
        break;
      }

      allItems.push(...data);

      if (meta) {
        totalPages = Math.max(1, Math.ceil(meta.total / Math.max(1, meta.limit)));
      } else {
        break;
      }

      page += 1;
    }

    const normalized = allItems.map(normalizeProduct);
    if (normalized.length > 0) {
      productCache = { data: normalized, ts: Date.now() };
      return normalized;
    }

    return staticProducts;
  } catch {
    return productCache?.data ?? staticProducts;
  }
}

export async function fetchProductByIdOrSlugFromApi(idOrSlug: string): Promise<Product | undefined> {
  try {
    const response = await fetch(`${getApiBaseUrl()}/products/${idOrSlug}`, { next: { revalidate: 60 } });
    if (!response.ok) {
      return undefined;
    }

    const payload = (await response.json()) as unknown;
    const data = extractData<AdminProduct>(payload);
    if (!data) {
      return undefined;
    }

    return normalizeProduct(data);
  } catch {
    return undefined;
  }
}

export async function fetchSliderOffersFromApi(): Promise<Product[]> {
  try {
    const response = await fetch(`${getApiBaseUrl()}/slider`, { next: { revalidate: 120 } });
    if (!response.ok) {
      return [];
    }

    const payload = (await response.json()) as unknown;
    const data = extractData<SliderProduct[]>(payload);
    if (!data || !Array.isArray(data)) {
      return [];
    }

    return data.map((item) => ({
      id: String(item.id),
      name: item.name,
      category: item.category as Product["category"],
      price: Number(item.bulkPrice),
      bulkPrice: Number(item.bulkPrice),
      minOrder: Number(item.minOrder),
      image: item.imageUrl,
      discount: Number(item.discountPct ?? 0),
    }));
  } catch {
    return [];
  }
}

export async function fetchHomeSlidesFromApi() {
  try {
    const response = await fetch(`${getApiBaseUrl()}/content/home-slides`, { next: { revalidate: 120 } });
    if (!response.ok) {
      return [] as HomeSlide[];
    }

    const payload = (await response.json()) as unknown;
    const data = extractData<HomeSlide[]>(payload);
    if (!data || !Array.isArray(data)) {
      return [] as HomeSlide[];
    }

    return data.sort((a, b) => (a.sortOrder ?? 999) - (b.sortOrder ?? 999));
  } catch {
    return [] as HomeSlide[];
  }
}

export async function createOrderInApi(payload: CreateOrderPayload) {
  const response = await fetch(`${getApiBaseUrl()}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const result = (await response.json().catch(() => null)) as unknown;

  if (!response.ok) {
    throw new Error("Failed to create order");
  }

  const order = extractData<{ orderNumber: string; id: string }>(result);
  return order;
}

export async function validatePromoCodeInApi(params: {
  code: string;
  items: Array<{ productId: string; quantity: number }>;
}): Promise<PromoValidationResult | null> {
  try {
    const response = await fetch(`${getApiBaseUrl()}/promos/validate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      return null;
    }

    const payload = (await response.json()) as unknown;
    const data = extractData<PromoValidationResult>(payload);
    if (!data) {
      return null;
    }

    return {
      ...data,
      discountAmount: Number(data.discountAmount),
      discountValue: Number(data.discountValue),
    };
  } catch {
    return null;
  }
}

export async function fetchOrderByNumberInApi(orderNumber: string): Promise<BuyerTrackedOrder | null> {
  try {
    const response = await fetch(`${getApiBaseUrl()}/orders/${encodeURIComponent(orderNumber)}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    const payload = (await response.json()) as unknown;
    const data = extractData<BuyerTrackedOrder>(payload);
    if (!data) {
      return null;
    }

    return {
      ...data,
      subtotal: Number(data.subtotal),
      shippingFee: Number(data.shippingFee),
      total: Number(data.total),
      items: Array.isArray(data.items)
        ? data.items.map((item) => ({
            ...item,
            unitPrice: Number(item.unitPrice),
            lineTotal: Number(item.lineTotal),
          }))
        : [],
    };
  } catch {
    return null;
  }
}
