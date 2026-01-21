import qs from "qs";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
const API_BASE = `${STRAPI_URL}/api`;

// --- Types ---
export interface StrapiBadge {
  id: number;
  documentId: string;
  label: string;
  tone: 'orange' | 'green' | 'red' | 'blue' | 'purple';
  isActive: boolean;
}

export interface StrapiCategory {
  id: number;
  documentId: string;
  Name: string; 
  slug?: string;
}

export interface StrapiProduct {
  id: number;
  documentId: string;
  Name: string;
  Description?: Array<{
    type: string;
    children?: Array<{ type: string; text: string }>;
  }>;
  Price?: number;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  badges?: StrapiBadge[]; 
  categories?: StrapiCategory[]; 
  Image?: Array<{
    id: number;
    url: string;
    alternativeText?: string;
    formats?: any;
  }>;
}

export interface StrapiListResponse<T> {
  data: T[];
  meta: { pagination: { page: number; pageSize: number; pageCount: number; total: number; }; };
}

export interface StrapiSingleResponse<T> {
  data: T; 
  meta: any;
}

// --- Fetch Helper ---
async function strapiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  const res = await fetch(url, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options.headers },
    // Revalidates every hour in production, every second in dev
    next: { revalidate: process.env.NODE_ENV === 'development' ? 1 : 3600 }, 
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    console.error(`[Strapi Error] ${res.status}:`, JSON.stringify(errorData, null, 2));
    throw new Error(`Strapi fetch failed: ${res.status}`);
  }
  return res.json();
}

/**
 * Prepends the Strapi URL to relative image paths.
 */
export function getStrapiMedia(url: string | null | undefined) {
  if (!url) return "";
  if (url.startsWith("http") || url.startsWith("//")) return url;
  return `${STRAPI_URL}${url}`;
}

// --- Query Builder ---
function buildQuery(params: {
  filters?: Record<string, any>;
  sort?: string | string[];
  populate?: any;
  pagination?: { limit?: number; page?: number };
  query?: string;
} = {}): string {
  const queryObj: any = {};

  // Standard population for Products
  queryObj.populate = params.populate || {
    Image: { fields: ['url', 'alternativeText'] },
    badges: { fields: ['label', 'tone', 'isActive'] },
    categories: { fields: ['Name'] }, 
  };

  const filters: any = params.filters || {};
  if (params.query) filters.Name = { $containsi: params.query };
  queryObj.filters = filters;

  if (params.sort) queryObj.sort = params.sort;
  if (params.pagination) {
    queryObj.pagination = { 
      pageSize: params.pagination.limit || 10, 
      page: params.pagination.page || 1 
    };
  }

  const queryString = qs.stringify(queryObj, { encodeValuesOnly: true });
  return queryString ? `?${queryString}` : "";
}

// --- API Methods ---

export async function getCategories(): Promise<StrapiCategory[]> {
  const query = qs.stringify({ sort: ['Name:asc'], fields: ['Name', 'documentId'] });
  const res = await strapiFetch<StrapiListResponse<StrapiCategory>>(`/categories?${query}`);
  return res.data || [];
}

export async function getPremiumProduct(): Promise<StrapiProduct | null> {
  const queryString = buildQuery({
    filters: { badges: { label: { $eq: 'Premium' } } },
    pagination: { limit: 1 }
  });
  const res = await strapiFetch<StrapiListResponse<StrapiProduct>>(`/products${queryString}`);
  return res.data?.[0] || null;
}

export async function getFeaturedProducts(limit = 8): Promise<StrapiProduct[]> {
  const queryString = buildQuery({
    filters: { badges: { label: { $eq: 'Featured' } } }, 
    sort: ['createdAt:desc'],
    pagination: { limit },
  });
  const res = await strapiFetch<StrapiListResponse<StrapiProduct>>(`/products${queryString}`);
  return res.data || [];
}

export async function getAllProducts(limit = 50, categoryName?: string, searchTerm?: string): Promise<StrapiProduct[]> {
  const filters: any = {};
  if (categoryName && categoryName !== 'All') {
    filters.categories = { Name: { $eq: categoryName } };
  }
  
  const queryString = buildQuery({ filters, query: searchTerm, pagination: { limit }, sort: ['createdAt:desc'] });
  const res = await strapiFetch<StrapiListResponse<StrapiProduct>>(`/products${queryString}`);
  return res.data || [];
}

export async function getProductById(documentId: string): Promise<StrapiProduct | null> {
  const queryString = buildQuery({});
  try {
    const res = await strapiFetch<StrapiSingleResponse<StrapiProduct>>(`/products/${documentId}${queryString}`);
    return res.data;
  } catch { return null; }
}

export async function getRecentProducts(limit = 8): Promise<StrapiProduct[]> {
  const queryString = buildQuery({
    sort: ['createdAt:desc'],
    pagination: { limit },
  });
  const res = await strapiFetch<StrapiListResponse<StrapiProduct>>(`/products${queryString}`);
  return res.data || [];
}