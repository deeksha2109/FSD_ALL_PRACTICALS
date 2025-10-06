// Centralized API client and response mappers

const API_BASE_URL = import.meta?.env?.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const getApiBaseUrl = () => API_BASE_URL;

function getAuthHeaders() {
  const token = typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request(path, options = {}) {
  const url = `${API_BASE_URL}${path}`;
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
      ...(options.headers || {})
    },
    credentials: 'include',
    ...options
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok || data.success === false) {
    const message = data?.message || `Request failed: ${response.status}`;
    throw new Error(message);
  }
  return data;
}

// --- Public endpoints ---
export async function fetchProducts(params = {}) {
  const query = new URLSearchParams();
  if (params.search) query.set('search', params.search);
  if (params.category) query.set('category', params.category);
  if (params.page) query.set('page', String(params.page));
  if (params.limit) query.set('limit', String(params.limit));
  if (params.sort) query.set('sort', params.sort);
  const qs = query.toString();
  const data = await request(`/products${qs ? `?${qs}` : ''}`);
  return {
    ...data,
    products: (data.products || []).map(mapProduct)
  };
}

export async function fetchProductsTotal() {
  const data = await fetchProducts({ limit: 1 });
  return data.total || 0;
}

export async function fetchProductById(id) {
  const data = await request(`/products/${id}`);
  return mapProduct(data.product);
}

export async function fetchCategories() {
  const data = await request(`/categories`);
  return (data.categories || data.data || data || []).map(mapCategory);
}

// --- Admin APIs ---
export async function fetchAdminOverview() {
  const data = await request('/orders/admin/overview');
  return data.data;
}

export async function fetchAdminOrders(params = {}) {
  const query = new URLSearchParams();
  if (params.page) query.set('page', String(params.page));
  if (params.limit) query.set('limit', String(params.limit));
  const qs = query.toString();
  return await request(`/orders${qs ? `?${qs}` : ''}`);
}

export async function fetchAdminUsersStats() {
  const data = await request('/users/stats/overview');
  return data.data;
}

// --- Business APIs ---
export async function fetchBusinessOverview() {
  const data = await request('/orders/business/overview');
  return data.data;
}

export async function fetchBusinessOrders() {
  const data = await request('/orders/business-orders');
  return data.orders;
}

// --- Mappers to UI shape ---
export function mapProduct(p) {
  if (!p) return null;
  const reviewsCount = Array.isArray(p.reviews) ? p.reviews.length : (p.ratings?.count || 0);
  const averageRating = typeof p.ratings?.average === 'number' ? p.ratings.average : 0;
  const stockQty = typeof p.inventory?.quantity === 'number' ? p.inventory.quantity : 0;
  const categoryName = typeof p.category === 'object' && p.category !== null ? (p.category.name || '') : (p.category || '');
  const discount = p.originalPrice && p.price ? Math.max(0, Math.round((1 - (p.price / p.originalPrice)) * 100)) : undefined;
  return {
    id: p._id || p.id,
    name: p.title || p.name,
    description: p.description || '',
    price: p.price,
    originalPrice: p.originalPrice,
    discount,
    image: p.image,
    seller: p.seller,
    category: categoryName,
    stock: stockQty,
    rating: averageRating,
    reviews: reviewsCount,
  };
}

export function mapCategory(c) {
  if (!c) return null;
  return {
    id: c._id || c.id,
    name: c.name,
    slug: c.slug,
    icon: c.icon || '📦',
    image: c.image,
    count: c.productCount || 0,
  };
}


