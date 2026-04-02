export type CartItem = {
  cartKey?: string;
  id: string;
  name: string;
  image?: string;
  price: number;
  quantity: number;
  minOrder?: number;
  maxQuantity?: number;
  selectedSize?: string;
  addedAt?: number;
};

export const CART_STORAGE_KEY = "eterna-cart";
export const CART_UPDATED_EVENT = "eterna-cart-updated";
export const MAX_CART_ITEMS = 100;
export const MAX_QUANTITY_PER_ITEM = 9999;

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function notifyCartUpdated() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(CART_UPDATED_EVENT));
  }
}

export function getCartItems(): CartItem[] {
  if (!canUseStorage()) {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .map((item) => {
        const value = item as Partial<CartItem>;
        return {
          cartKey: value.cartKey ? String(value.cartKey) : undefined,
          id: String(value.id ?? ""),
          name: String(value.name ?? ""),
          image: value.image ? String(value.image) : undefined,
          price: Number(value.price ?? 0),
          quantity: Number(value.quantity ?? 0),
          minOrder: value.minOrder !== undefined ? Number(value.minOrder) : undefined,
          maxQuantity: value.maxQuantity !== undefined ? Number(value.maxQuantity) : undefined,
          selectedSize: value.selectedSize ? String(value.selectedSize) : undefined,
          addedAt: value.addedAt !== undefined ? Number(value.addedAt) : undefined,
        };
      })
      .filter((item) => item.id && item.name && Number.isFinite(item.price) && item.price >= 0 && Number.isFinite(item.quantity) && item.quantity > 0);
  } catch {
    return [];
  }
}

export function saveCartItems(items: CartItem[]) {
  if (!canUseStorage()) {
    return;
  }

  const validItems = items
    .filter((item) => item.id && item.name && Number.isFinite(item.price) && item.price >= 0 && Number.isFinite(item.quantity) && item.quantity > 0)
    .slice(0, MAX_CART_ITEMS);

  window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(validItems));
  notifyCartUpdated();
}

export function addItemToCart(item: CartItem) {
  if (!item.id || !item.name || !Number.isFinite(item.price) || item.price < 0 || !Number.isFinite(item.quantity) || item.quantity <= 0) {
    return false;
  }

  const current = getCartItems();
  if (current.length >= MAX_CART_ITEMS) {
    return false;
  }

  const resolvedCartKey = item.cartKey || (item.selectedSize ? `${item.id}::${item.selectedSize.toLowerCase()}` : item.id);
  const existingIndex = current.findIndex((entry) => (entry.cartKey || entry.id) === resolvedCartKey);

  const maxQty = item.maxQuantity ?? MAX_QUANTITY_PER_ITEM;

  if (existingIndex >= 0) {
    const newQty = current[existingIndex].quantity + item.quantity;
    current[existingIndex].quantity = Math.min(newQty, maxQty);
    if (item.image) {
      current[existingIndex].image = item.image;
    }
    if (item.minOrder !== undefined) {
      current[existingIndex].minOrder = item.minOrder;
    }
    if (item.selectedSize) {
      current[existingIndex].selectedSize = item.selectedSize;
    }
    current[existingIndex].cartKey = resolvedCartKey;
  } else {
    current.push({ ...item, cartKey: resolvedCartKey, quantity: Math.min(item.quantity, maxQty), addedAt: Date.now() });
  }

  saveCartItems(current);
  return true;
}

export function updateCartItemQuantity(idOrCartKey: string, quantity: number) {
  if (!Number.isFinite(quantity) || quantity < 0) {
    return;
  }

  const current = getCartItems();
  const maxQty = MAX_QUANTITY_PER_ITEM;
  const next = current
    .map((item) => ((item.cartKey || item.id) === idOrCartKey ? { ...item, quantity: Math.min(quantity, maxQty) } : item))
    .filter((item) => item.quantity > 0);

  saveCartItems(next);
}

export function removeCartItem(idOrCartKey: string) {
  const current = getCartItems();
  const next = current.filter((item) => (item.cartKey || item.id) !== idOrCartKey);
  saveCartItems(next);
}

export function clearCart() {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.removeItem(CART_STORAGE_KEY);
  notifyCartUpdated();
}

export function getCartCount() {
  return getCartItems().reduce((count, item) => count + item.quantity, 0);
}

export function getCartTotal(): number {
  return getCartItems().reduce((total, item) => total + item.price * item.quantity, 0);
}

export function getCartSubtotal(items?: CartItem[]): number {
  const cartItems = items ?? getCartItems();
  return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
}

export function sortCartItems(items: CartItem[], by: "price-asc" | "price-desc" | "name" | "addedAt" = "addedAt"): CartItem[] {
  const sorted = [...items];
  switch (by) {
    case "price-asc":
      return sorted.sort((a, b) => a.price - b.price);
    case "price-desc":
      return sorted.sort((a, b) => b.price - a.price);
    case "name":
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case "addedAt":
    default:
      return sorted.sort((a, b) => (b.addedAt ?? 0) - (a.addedAt ?? 0));
  }
}

export function getCartItem(idOrCartKey: string): CartItem | undefined {
  return getCartItems().find((item) => (item.cartKey || item.id) === idOrCartKey);
}

export function applyMinOrder(item: CartItem): CartItem {
  if (item.minOrder && item.quantity < item.minOrder) {
    return { ...item, quantity: item.minOrder };
  }
  return item;
}

export function mergeCartDuplicates(items: CartItem[]): CartItem[] {
  const merged = new Map<string, CartItem>();
  
  for (const item of items) {
    const key = item.cartKey || item.id;
    const existing = merged.get(key);
    
    if (existing) {
      existing.quantity += item.quantity;
      existing.quantity = Math.min(existing.quantity, item.maxQuantity ?? MAX_QUANTITY_PER_ITEM);
    } else {
      merged.set(key, { ...item });
    }
  }
  
  return Array.from(merged.values());
}
