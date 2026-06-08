const API = import.meta.env.VITE_SERVER_API;
const GUEST_CART_ID_KEY = "guest_cart_id";

function createGuestId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `guest-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function getGuestCartId() {
  let guestId = localStorage.getItem(GUEST_CART_ID_KEY);

  if (!guestId) {
    guestId = createGuestId();
    localStorage.setItem(GUEST_CART_ID_KEY, guestId);
  }

  return guestId;
}

export function clearGuestCartId() {
  localStorage.removeItem(GUEST_CART_ID_KEY);
}

function getAuthHeaders() {
  const token = localStorage.getItem("token");

  return {
    "Content-Type": "application/json",
    ...(token
      ? { Authorization: `Bearer ${token}` }
      : { "x-guest-id": getGuestCartId() }),
  };
}

async function handleResponse(response) {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data.message || `Cart request failed (${response.status})`,
    );
  }

  return data;
}

function resolveImage(url) {
  if (!url) return "/products/placeholder.png";

  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  return url.startsWith("/") ? url : `/${url}`;
}

function normalizeCartItem(raw) {
  const product = raw.product || raw;
  const productId = raw.product_id ?? product.product_id ?? product.id;

  return {
    // Your current backend cart routes use product_id in the URL.
    // Keep cartItemId equal to productId so Cart.jsx can keep using one id field.
    cartItemId: productId,
    productId,
    itemId: raw.cart_item_id ?? raw.cartItemId ?? raw.id ?? null,
    name: product.name ?? raw.product_name ?? "",
    category: product.category_name ?? raw.category_name ?? "",
    image: resolveImage(
      product.primary_image ??
        product.image_url ??
        raw.primary_image ??
        raw.image_url,
    ),
    price: Number(product.price ?? raw.price) || 0,
    originalPrice: product.original_price
      ? Number(product.original_price)
      : raw.original_price
        ? Number(raw.original_price)
        : null,
    quantity: Number(raw.quantity) || 1,
    stockQty: Number(product.stock_qty ?? raw.stock_qty) || 0,
    selected: raw.selected ?? true,
    sizeValue: product.size_value ?? raw.size_value ?? null,
    sizeUnit: product.size_unit ?? raw.size_unit ?? null,
  };
}

function normalizeCart(data) {
  const rawItems = Array.isArray(data.items)
    ? data.items
    : Array.isArray(data.cart?.items)
      ? data.cart.items
      : [];

  return {
    id: data.cart?.id ?? data.cart_id ?? data.id ?? null,
    type: data.cart?.type ?? data.type ?? null,
    itemCount: data.cart?.item_count ?? data.item_count ?? rawItems.length,
    subtotal: Number(data.cart?.subtotal ?? data.subtotal ?? 0),
    items: rawItems.map(normalizeCartItem),
    coupon: data.coupon ?? data.cart?.coupon ?? null,
  };
}

export async function getCart() {
  const response = await fetch(`${API}/api/cart`, {
    headers: getAuthHeaders(),
  });

  const data = await handleResponse(response);
  return normalizeCart(data);
}

export async function addToCart(productId, quantity = 1) {
  const response = await fetch(`${API}/api/cart/items`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({
      product_id: productId,
      quantity,
    }),
  });

  const data = await handleResponse(response);
  return normalizeCart(data);
}

export async function updateCartItemQuantity(productId, quantity) {
  const response = await fetch(`${API}/api/cart/items/${productId}`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify({
      quantity,
    }),
  });

  const data = await handleResponse(response);
  return normalizeCart(data);
}

export async function removeCartItem(productId) {
  const response = await fetch(`${API}/api/cart/items/${productId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  return handleResponse(response);
}

export async function removeSelectedCartItems(productIds) {
  const response = await fetch(`${API}/api/cart/items/remove-selected`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({
      product_ids: productIds,
    }),
  });

  return handleResponse(response);
}

export async function mergeGuestCart() {
  const guestId = localStorage.getItem(GUEST_CART_ID_KEY);

  if (!guestId) return null;

  const response = await fetch(`${API}/api/cart/merge`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({
      guest_id: guestId,
    }),
  });

  const data = await handleResponse(response);
  clearGuestCartId();
  return normalizeCart(data);
}

export async function applyCartCoupon(code) {
  const response = await fetch(`${API}/api/cart/coupon`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({
      code,
    }),
  });

  return handleResponse(response);
}

export async function removeCartCoupon() {
  const response = await fetch(`${API}/api/cart/coupon`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  return handleResponse(response);
}