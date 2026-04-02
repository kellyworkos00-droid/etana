/**
 * Seller API client for frontend
 * Makes requests to seller endpoints in the admin backend
 */

export interface SellerDashboardData {
  seller: {
    id: string;
    businessName: string;
    email: string;
    phone: string;
    rating: number;
    totalOrders: number;
  };
  stats: {
    totalRevenue: number;
    totalPayout: number;
    totalOrders: number;
    totalCommissions: number;
  };
  recentOrders: Array<{
    id: string;
    orderNumber: string;
    status: string;
    paymentStatus: string;
    subtotal: number;
    sellerPayout: number;
    createdAt: Date;
  }>;
  subscriptionInfo: {
    tier: string;
    status: string;
    expiresAt: Date | null;
  };
}

export interface SellerOrder {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  subtotal: number;
  platformFee: number;
  shippingFee: number;
  sellerPayout: number;
  createdAt: Date;
  deliveredAt: Date | null;
  items: Array<{
    id: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    lineTotal: number;
  }>;
}

/**
 * Fetch seller dashboard data
 */
export async function fetchSellerDashboard(
  sellerId: string
): Promise<SellerDashboardData> {
  const response = await fetch(
    `/api/v1/seller/dashboard?sellerId=${sellerId}`,
    {
      headers: {
        "Content-Type": "application/json",
        "X-Seller-ID": sellerId,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch seller dashboard: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Fetch seller's orders
 */
export async function fetchSellerOrders(
  sellerId: string,
  limit = 20,
  offset = 0
): Promise<{ orders: SellerOrder[]; total: number }> {
  const response = await fetch(
    `/api/v1/seller/orders?limit=${limit}&offset=${offset}`,
    {
      headers: {
        "Content-Type": "application/json",
        "X-Seller-ID": sellerId,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch seller orders: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Fetch seller's products
 */
export async function fetchSellerProducts(
  sellerId: string,
  category?: string,
  search?: string
): Promise<{
  products: Array<{
    id: string;
    sku: string;
    name: string;
    category: string;
    imageUrl: string;
    price: number;
    bulkPrice: number;
    minOrder: number;
    maxOrder: number | null;
    stockQty: number;
    discountPct: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
  }>;
  pagination: { total: number; limit: number; offset: number };
}> {
  const params = new URLSearchParams();
  if (category) params.append("category", category);
  if (search) params.append("search", search);

  const response = await fetch(`/api/v1/seller/products?${params.toString()}`, {
    headers: {
      "Content-Type": "application/json",
      "X-Seller-ID": sellerId,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch seller products: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Fetch seller subscription info
 */
export async function fetchSellerSubscription(
  sellerId: string
): Promise<{
  subscription: {
    tier: string;
    status: string;
    expiresAt: Date | null;
    features: Record<string, any>;
  };
}> {
  const response = await fetch(`/api/v1/seller/subscription`, {
    headers: {
      "Content-Type": "application/json",
      "X-Seller-ID": sellerId,
    },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch seller subscription: ${response.statusText}`
    );
  }

  return response.json();
}

export type SellerInfo = {
  id: string;
  businessName: string;
  businessType: string;
  email: string;
  phone: string;
  address?: string;
  status: string;
};

export async function registerSeller(payload: {
  businessName: string;
  businessType: string;
  phone: string;
  email: string;
  address?: string;
  description?: string;
}): Promise<{ seller: SellerInfo }> {
  const response = await fetch(`/api/v1/admin/sellers`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || "Failed to register seller");
  }

  return response.json();
}

export async function createSellerProduct(
  sellerId: string,
  product: {
    name: string;
    sku: string;
    category: string;
    description?: string;
    imageUrl?: string;
    price: number;
    bulkPrice: number;
    minOrder: number;
    maxOrder?: number;
    stockQty?: number;
    discountPct?: number;
  }
): Promise<{ success: boolean; product: Record<string, any> }> {
  const response = await fetch(`/api/v1/seller/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Seller-ID": sellerId,
    },
    body: JSON.stringify(product),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || "Failed to create seller product");
  }

  return response.json();
}
