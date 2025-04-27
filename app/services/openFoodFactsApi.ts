// app/services/openFoodFactsApi.ts
// No need to import getAuthHeader for OpenFoodFacts API since it's public

const BASE_URL = 'https://world.openfoodfacts.org';

export interface Product {
  code: string;
  product_name: string;
  brands?: string;
  image_url?: string;
  image_small_url?: string;
  categories?: string;
  ingredients_text?: string;
  nutriments?: {
    [key: string]: number | string;
  };
}

export interface SearchResponse {
  count: number;
  page: number;
  page_size: number;
  products: Product[];
}

export class OpenFoodFactsApi {
  // Search products by name
  // Search products by name
// Search products by name
static async searchProducts(query: string, page: number = 1): Promise<SearchResponse> {
  try {
    if (!query.trim()) {
      return { count: 0, page: 1, page_size: 0, products: [] };
    }

    // Add timeout to prevent hanging requests
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    const response = await fetch(
      `${BASE_URL}/cgi/search.pl?search_terms=${encodeURIComponent(query)}&json=true&page=${page}&page_size=15&fields=code,product_name,brands,image_url,image_small_url,categories`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Sensitive Foods App/1.0', // Some APIs require a user agent
        },
        signal: controller.signal
      }
    );
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      console.error('Response not OK:', response.status, response.statusText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Ensure products array exists
    if (!data.products) {
      return { count: 0, page: 1, page_size: 0, products: [] };
    }
    
    return data;
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        console.error('Request timed out');
      } else {
        console.error('Error searching products:', error);
      }
    } else {
      console.error('Unknown error', error);
    }
    // Return empty result instead of throwing
    return { count: 0, page: 1, page_size: 0, products: [] };
  }
}


  // Get product by barcode
  static async getProductByBarcode(barcode: string): Promise<Product | null> {
    try {
      const response = await fetch(`${BASE_URL}/api/v2/product/${barcode}.json`);
      
      if (!response.ok) {
        return null;
      }
      
      const data = await response.json();
      return data.product;
    } catch (error) {
      console.error('Error fetching product by barcode:', error);
      return null;
    }
  }

  // Search products by category
  static async getProductsByCategory(category: string, page: number = 1): Promise<SearchResponse> {
    try {
      const response = await fetch(
        `${BASE_URL}/category/${encodeURIComponent(category)}.json?page=${page}&page_size=15&fields=code,product_name,brands,image_url,image_small_url`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch products by category');
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching products by category:', error);
      throw error;
    }
  }
}