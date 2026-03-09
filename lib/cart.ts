export type CartItem = {
  id: string;
  name: string;
  image?: string;
  price: number;
  quantity: number;
  minOrder?: number;
};

export const CART_STORAGE_KEY = "eterna-cart";
export const CART_UPDATED_EVENT = "eterna-cart-updated";

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
          id: String(value.id ?? ""),
          name: String(value.name ?? ""),
          image: value.image ? String(value.image) : undefined,
          price: Number(value.price ?? 0),
          quantity: Number(value.quantity ?? 0),
          minOrder: value.minOrder !== undefined ? Number(value.minOrder) : undefined,
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

  window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  notifyCartUpdated();
}

export function addItemToCart(item: CartItem) {
  const current = getCartItems();
  const existingIndex = current.findIndex((entry) => entry.id === item.id);

  if (existingIndex >= 0) {
    current[existingIndex].quantity += item.quantity;
    if (item.image) {
      current[existingIndex].image = item.image;
    }
    if (item.minOrder !== undefined) {
      current[existingIndex].minOrder = item.minOrder;
    }
  } else {
    current.push(item);
  }

  saveCartItems(current);
}

export function updateCartItemQuantity(id: string, quantity: number) {
  const current = getCartItems();
  const next = current
    .map((item) => (item.id === id ? { ...item, quantity } : item))
    .filter((item) => item.quantity > 0);

  saveCartItems(next);
}

export function removeCartItem(id: string) {
  const current = getCartItems();
  const next = current.filter((item) => item.id !== id);
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
