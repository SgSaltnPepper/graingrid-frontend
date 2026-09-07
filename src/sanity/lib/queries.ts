import { groq } from "next-sanity";
import { client } from "./client"; 

// --- 1. Fetch All Products ---
export async function getProducts(limit = 50, categoryName: string = '', searchTerm: string = '') {
  const query = groq`
    *[_type == "product" 
      && ($categoryName == '' || $categoryName == 'All' || $categoryName in categories[]->Name)
      && ($searchTerm == '' || Name match $searchTerm + "*")
    ] | order(_createdAt desc) [0...$limit] {
      _id,
      Name,
      Price,
      Description, // <-- ADDED: Main Product Description
      "Image": Image.secure_url, 
      categories[]->{ _id, Name },
      badges[]->{ _id, label, tone, isActive },
      variants[]{
        ...,
        "variantImage": variantImage.secure_url
      },
      FAQs
    }
  `;
  
  return await client.fetch(query, { limit, categoryName, searchTerm });
}

// --- 2. Fetch Single Product by ID ---
export async function getProductById(id: string) {
  const query = groq`
    *[_type == "product" && _id == $id][0] {
      _id,
      Name,
      Price,
      "Image": Image.secure_url,
      categories[]->{ _id, Name },
      badges[]->{ _id, label, tone, isActive },
      variants[]{
        ...,
        "variantImage": variantImage.secure_url
      },
      FAQs
    }
  `;
  
  return await client.fetch(query, { id });
}

// --- 3. Fetch Categories ---
export async function getCategories() {
  const query = groq`
    *[_type == "category" && !defined(parent)] | order(Name asc) {
      _id,
      Name,
      "CatImage": CatImage.secure_url,
      "subcategories": *[_type == "category" && references(^._id)] {
        _id,
        Name,
        "CatImage": CatImage.secure_url
      }
    }
  `;
  
  return await client.fetch(query);
}

// --- 4. Fetch Featured Products ---
export async function getFeaturedProducts(limit = 8) {
  const query = groq`
    *[_type == "product" && references(*[_type == "badge" && label match "Premium*" && isActive == true]._id)] | order(_createdAt desc) [0...$limit] {
      _id,
      Name,
      Price,
      "Image": Image.secure_url,
      categories[]->{ _id, Name },
      badges[]->{ _id, label, tone, isActive },
      variants[]{
        ...,
        "variantImage": variantImage.secure_url
      },
      FAQs
    }
  `;
  
  return await client.fetch(query, { limit });
}