import type { Product } from "@/lib/products";

export const LIVE_REFRESH_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes

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

function getApiBaseUrl() {
  if (process.env.NEXT_PUBLIC_API_BASE_URL) {
    return process.env.NEXT_PUBLIC_API_BASE_URL;
  }

  return process.env.NODE_ENV === "production"
    ? "https://eterna-admin-jade.vercel.app/api/v1"
    : "http://localhost:3001/api/v1";
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

export async function fetchProductsFromApi(): Promise<Product[]> {
  try {
    const pageSize = 100;
    let page = 1;
    let totalPages = 1;
    const allItems: AdminProduct[] = [];

    while (page <= totalPages) {
      const response = await fetch(`${getApiBaseUrl()}/products?page=${page}&limit=${pageSize}`, {
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

    return allItems.map(normalizeProduct);
  } catch {
    return [];
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
