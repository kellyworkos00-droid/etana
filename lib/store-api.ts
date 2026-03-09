import { products as fallbackProducts, type Product } from "@/lib/products";

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
};

type CreateOrderPayload = {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  addressLine1: string;
  city: string;
  notes?: string;
  paymentMethod: "CARD" | "MPESA" | "BANK" | "COD";
  items: Array<{ productId: string; quantity: number }>;
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
  return {
    id: String(item.id),
    name: item.name,
    category: item.category as Product["category"],
    price: Number(item.price),
    bulkPrice: Number(item.bulkPrice),
    minOrder: Number(item.minOrder),
    image: item.imageUrl,
    discount: Number(item.discountPct ?? 0),
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

export async function fetchProductsFromApi(): Promise<Product[]> {
  try {
    const response = await fetch(`${getApiBaseUrl()}/products`, { cache: "no-store" });
    if (!response.ok) {
      return fallbackProducts;
    }

    const payload = (await response.json()) as unknown;
    const data = extractData<AdminProduct[]>(payload);
    if (!data || !Array.isArray(data)) {
      return fallbackProducts;
    }

    return data.map(normalizeProduct);
  } catch {
    return fallbackProducts;
  }
}

export async function fetchProductByIdOrSlugFromApi(idOrSlug: string): Promise<Product | undefined> {
  try {
    const response = await fetch(`${getApiBaseUrl()}/products/${idOrSlug}`, { cache: "no-store" });
    if (!response.ok) {
      return fallbackProducts.find((product) => product.id === idOrSlug);
    }

    const payload = (await response.json()) as unknown;
    const data = extractData<AdminProduct>(payload);
    if (!data) {
      return fallbackProducts.find((product) => product.id === idOrSlug);
    }

    return normalizeProduct(data);
  } catch {
    return fallbackProducts.find((product) => product.id === idOrSlug);
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
