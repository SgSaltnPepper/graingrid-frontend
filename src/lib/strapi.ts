import qs from "qs";

// Default to your Render URL if env var is missing
const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'https://graingrid-backend.onrender.com';
const API_BASE = `${STRAPI_URL}/api`;

// --- Interfaces ---
export type BadgeTone = "orange" | "green" | "red" | "blue" | "purple";

export interface StrapiBadge {
  id: number;
  label: string;
  tone: BadgeTone;
  isActive: boolean;
}

export interface StrapiCategory {
  id: number;
  documentId: string;
  Name: string;
  CatImage?: any;
  // Support for nested categories
  subcategories?: StrapiCategory[];
  parent?: StrapiCategory;
}

export interface StrapiFAQ {
  id: number;
  Ques: string;
  Ans: string;
}

export interface StrapiVariant {
  id: number;
  Type: string;
  Description: string;
  variantImage?: any;
  Label?: string; 
  Value?: string; 
}

export interface StrapiProduct { 
  id: number; 
  documentId: string; 
  Name: string; 
  Description?: any; 
  Price: number; 
  badges?: StrapiBadge[]; 
  categories?: StrapiCategory[]; 
  Image?: any; 
  variants?: StrapiVariant[]; 
  FAQs?: StrapiFAQ[]; 
}

// --- Robust Flattener ---
function flatten(data: any): any {
  if (!data) return null;
  if (data.data !== undefined) return flatten(data.data);
  if (Array.isArray(data)) return data.map((item: any) => flatten(item));
  if (typeof data === 'object' && data !== null) {
    const id = data.id;
    const documentId = data.documentId;
    const attributes = data.attributes ? data.attributes : data;
    let flattened: any = { id, documentId };
    Object.keys(attributes).forEach((key) => {
      if (key !== 'id' && key !== 'documentId') {
        flattened[key] = flatten(attributes[key]);
      }
    });
    return flattened;
  }
  return data;
}

// --- Failsafe Fetch Wrapper ---
async function fetchStrapi(path: string) {
  const url = `${API_BASE}${path.startsWith('/') ? path : `/${path}`}`;
  
  try {
    const response = await fetch(url, { 
        cache: 'no-store',
        headers: {
            'Content-Type': 'application/json',
        }
    });
    
    if (!response.ok) {
        console.error(`[Strapi Error]: ${response.status} on ${url}`);
        return null;
    }
    
    const json = await response.json();
    return flatten(json);
  } catch (error) {
    // Gracefully catch the "fetch failed" error (usually due to Render backend sleeping)
    console.warn(`[Strapi Connection Warning]: Could not fetch from ${url}. The backend might be asleep or offline.`);
    return null;
  }
}

export function getStrapiMedia(data: any) {
  if (!data) return "/placeholder-product.jpg";
  let url = "";
  if (Array.isArray(data) && data.length > 0) {
    url = data[0].url || data[0].attributes?.url;
  } else if (data.url) {
    url = data.url;
  }
  
  if (!url) return "/placeholder-product.jpg";

  // Cloudinary/External URL check
  if (url.startsWith("http")) return url;

  // Local Strapi URL fallback
  return `${STRAPI_URL}${url}`;
}

// --- API Methods ---

export async function getCategories(): Promise<StrapiCategory[]> {
  // Fetch only top-level categories (where parent is null)
  // Populate subcategories to build the tree structure
  const query = qs.stringify({ 
    populate: {
        CatImage: { populate: '*' },
        subcategories: { populate: '*' }
    },
    filters: {
        parent: {
            id: {
                $null: true 
            }
        }
    },
    sort: ['Name:asc'] 
  }, { encodeValuesOnly: true });

  const res = await fetchStrapi(`/categories?${query}`);
  return Array.isArray(res) ? res : [];
}

export async function getAllProducts(limit = 50, categoryName?: string, searchTerm?: string): Promise<StrapiProduct[]> {
  const query = qs.stringify({
    populate: {
      Image: { populate: '*' },
      badges: { populate: '*' },
      categories: { populate: '*' },
      variants: { populate: { variantImage: { populate: '*' } } },
      FAQs: { populate: '*' }
    },
    filters: {
      $and: [
        // STRICT MATCHING ($eq) to prevent "Non-Basmati" showing up when searching "Basmati"
        categoryName && categoryName !== 'All' ? { categories: { Name: { $eq: categoryName } } } : {},
        searchTerm ? { Name: { $containsi: searchTerm } } : {},
      ].filter(f => Object.keys(f).length > 0)
    },
    pagination: { pageSize: limit },
    sort: ['createdAt:desc']
  }, { encodeValuesOnly: true });

  const res = await fetchStrapi(`/products?${query}`);
  return Array.isArray(res) ? res : [];
}

export async function getRecentProducts(limit = 8): Promise<StrapiProduct[]> {
  return await getAllProducts(limit);
}

export async function getProductById(id: string): Promise<StrapiProduct | null> {
  const query = qs.stringify({
    populate: {
      Image: { populate: '*' },
      badges: { populate: '*' },
      categories: { populate: '*' },
      variants: { populate: { variantImage: { populate: '*' } } },
      FAQs: { populate: '*' }
    }
  }, { encodeValuesOnly: true });
  
  return await fetchStrapi(`/products/${id}?${query}`);
}

export async function getFeaturedProducts(limit = 8): Promise<StrapiProduct[]> {
    const query = qs.stringify({
        populate: { 
          Image: { populate: '*' }, 
          badges: { populate: '*' }, 
          categories: { populate: '*' } 
        },
        filters: { 
          badges: { 
            label: { $containsi: 'Featur' },
            isActive: { $eq: true } 
          } 
        },
        pagination: { pageSize: limit }
    }, { encodeValuesOnly: true });
    
    const res = await fetchStrapi(`/products?${query}`);
    return Array.isArray(res) ? res : [];
}

export async function getPremiumProduct(): Promise<StrapiProduct | null> {
  const products = await getFeaturedProducts(1);
  return products[0] || null;
}