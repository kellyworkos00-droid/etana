export enum SubscriptionTier {
  FREE = "FREE",
  BASIC = "BASIC",
  PRO = "PRO",
  ELITE = "ELITE",
}

export enum SubscriptionStatus {
  ACTIVE = "ACTIVE",
  EXPIRED = "EXPIRED",
  CANCELLED = "CANCELLED",
  PAST_DUE = "PAST_DUE",
}

export const SUBSCRIPTION_PRICING: Record<SubscriptionTier, number> = {
  [SubscriptionTier.FREE]: 0,
  [SubscriptionTier.BASIC]: 1000,
  [SubscriptionTier.PRO]: 3000,
  [SubscriptionTier.ELITE]: 5000,
};

export const PLATFORM_FEE_PERCENT = 0.03;
export const PLATFORM_FEE_MIN = 100;
export const PLATFORM_FEE_MAX = 200;

export const DELIVERY_MARGIN_MIN = 50;
export const DELIVERY_MARGIN_MAX = 150;

export const AD_BOOST_DAILY_MIN = 100;
export const AD_BOOST_DAILY_MAX = 300;
export const AD_HOME_PAGE_DAILY_MIN = 500;
export const AD_HOME_PAGE_DAILY_MAX = 1000;

export const BUYER_SERVICE_FEE_MIN = 20;
export const BUYER_SERVICE_FEE_MAX = 100;

export enum SellerStatus {
  PENDING = "PENDING",
  VERIFIED = "VERIFIED",
  SUSPENDED = "SUSPENDED",
  REJECTED = "REJECTED",
}

export type Seller = {
  id: string;
  userId: string;
  businessName: string;
  businessType: string;
  description?: string;
  phone: string;
  email: string;
  address?: string;
  logo?: string;
  status: SellerStatus;
  subscriptionTier: SubscriptionTier;
  subscriptionStatus: SubscriptionStatus;
  subscriptionExpiresAt?: Date;
  rating: number;
  totalOrders: number;
  createdAt: Date;
  updatedAt: Date;
};

export type SellerSubscription = {
  id: string;
  sellerId: string;
  tier: SubscriptionTier;
  status: SubscriptionStatus;
  amount: number;
  startDate: Date;
  endDate: Date;
  autoRenew: boolean;
  createdAt: Date;
};

export enum OrderStatus {
  PENDING = "PENDING",
  PAID = "PAID",
  CONFIRMED = "CONFIRMED",
  PACKING = "PACKING",
  READY_FOR_PICKUP = "READY_FOR_PICKUP",
  PICKED_UP = "PICKED_UP",
  ON_DELIVERY = "ON_DELIVERY",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
}

export enum PaymentStatus {
  PENDING = "PENDING",
  ESCROW_HELD = "ESCROW_HELD",
  PAID = "PAID",
  RELEASED = "RELEASED",
  FAILED = "FAILED",
  REFUNDED = "REFUNDED",
}

export enum PaymentMethod {
  CARD = "CARD",
  MPESA = "MPESA",
  BANK = "BANK",
  COD = "COD",
}

export type Order = {
  id: string;
  orderNumber: string;
  userId?: string;
  sellerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  addressLine1: string;
  city: string;
  notes?: string;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  subtotal: number;
  platformFee: number;
  deliveryFee: number;
  total: number;
  escrowAmount: number;
  sellerPayout: number;
  pickupOtp?: string;
  deliveryOtp?: string;
  riderName?: string;
  riderPhone?: string;
  logisticsPartner?: string;
  items: OrderItem[];
  createdAt: Date;
  updatedAt: Date;
};

export type OrderItem = {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  productImage?: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
};

export type DeliveryQuote = {
  id: string;
  orderId: string;
  partner: string;
  pickupLocation: string;
  deliveryLocation: string;
  estimatedCost: number;
  estimatedDays: number;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
};

export type QuoteRequest = {
  id: string;
  buyerId: string;
  sellerId: string;
  items: Array<{
    productId: string;
    productName: string;
    quantity: number;
  }>;
  description?: string;
  budget?: number;
  status: "PENDING" | "QUOTED" | "ACCEPTED" | "REJECTED";
  sellerQuote?: number;
  createdAt: Date;
};

export type RevenueMetrics = {
  platformFees: number;
  deliveryMargins: number;
  subscriptionRevenue: number;
  adRevenue: number;
  buyerFees: number;
  totalRevenue: number;
  orderCount: number;
  averageOrderValue: number;
};

export type SellerPayout = {
  id: string;
  sellerId: string;
  orderId: string;
  amount: number;
  platformFee: number;
  deliveryCost: number;
  netAmount: number;
  status: "PENDING" | "PROCESSED" | "PAID";
  processedAt?: Date;
  createdAt: Date;
};

export type AdCampaign = {
  id: string;
  sellerId: string;
  productId?: string;
  type: "BOOST" | "HOME_FEATURE";
  startDate: Date;
  endDate: Date;
  dailyBudget: number;
  totalSpend: number;
  status: "ACTIVE" | "PAUSED" | "COMPLETED";
  impressions: number;
  clicks: number;
};

export function calculatePlatformFee(orderTotal: number): number {
  const fee = orderTotal * PLATFORM_FEE_PERCENT;
  return Math.min(Math.max(fee, PLATFORM_FEE_MIN), PLATFORM_FEE_MAX);
}

export function calculateSellerPayout(
  orderTotal: number,
  deliveryCost: number
): { platformFee: number; sellerPayout: number } {
  const platformFee = calculatePlatformFee(orderTotal);
  const sellerPayout = orderTotal - platformFee - deliveryCost;
  return {
    platformFee,
    sellerPayout: Math.max(0, sellerPayout),
  };
}

export function calculateRevenueMetrics(orders: Order[]): RevenueMetrics {
  let platformFees = 0;
  let deliveryMargins = 0;
  let orderCount = 0;
  let totalValue = 0;

  for (const order of orders) {
    if (order.paymentStatus === PaymentStatus.PAID || order.paymentStatus === PaymentStatus.RELEASED) {
      platformFees += Number(order.platformFee) || 0;
      deliveryMargins += Number(order.deliveryFee) || 0;
      orderCount++;
      totalValue += Number(order.total) || 0;
    }
  }

  return {
    platformFees,
    deliveryMargins,
    subscriptionRevenue: 0,
    adRevenue: 0,
    buyerFees: 0,
    totalRevenue: platformFees + deliveryMargins,
    orderCount,
    averageOrderValue: orderCount > 0 ? totalValue / orderCount : 0,
  };
}

export function generateOtp(length: number = 6): string {
  const digits = "0123456789";
  let otp = "";
  for (let i = 0; i < length; i++) {
    otp += digits[Math.floor(Math.random() * digits.length)];
  }
  return otp;
}

export function isValidOtp(entered: string, expected: string): boolean {
  if (!entered || !expected) return false;
  return entered.trim() === expected.trim();
}

export function getOrderStatusFlow(): OrderStatus[] {
  return [
    OrderStatus.PENDING,
    OrderStatus.PAID,
    OrderStatus.CONFIRMED,
    OrderStatus.PACKING,
    OrderStatus.READY_FOR_PICKUP,
    OrderStatus.PICKED_UP,
    OrderStatus.ON_DELIVERY,
    OrderStatus.DELIVERED,
  ];
}

export function canTransitionStatus(
  current: OrderStatus,
  next: OrderStatus
): boolean {
  const allowedTransitions: Record<OrderStatus, OrderStatus[]> = {
    [OrderStatus.PENDING]: [OrderStatus.PAID, OrderStatus.CANCELLED],
    [OrderStatus.PAID]: [OrderStatus.CONFIRMED, OrderStatus.CANCELLED],
    [OrderStatus.CONFIRMED]: [OrderStatus.PACKING, OrderStatus.CANCELLED],
    [OrderStatus.PACKING]: [OrderStatus.READY_FOR_PICKUP, OrderStatus.CANCELLED],
    [OrderStatus.READY_FOR_PICKUP]: [OrderStatus.PICKED_UP],
    [OrderStatus.PICKED_UP]: [OrderStatus.ON_DELIVERY],
    [OrderStatus.ON_DELIVERY]: [OrderStatus.DELIVERED],
    [OrderStatus.DELIVERED]: [],
    [OrderStatus.CANCELLED]: [],
  };

  return allowedTransitions[current]?.includes(next) ?? false;
}
