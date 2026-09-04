import { apiClient } from './client';
import { Product, Category, Brand, Collection, ProductColor, ProductSize, ProductMaterial } from '../types/product';
import { ApiResponse, PaginatedResourceResponse } from '../types/api';

export interface ProductQueryParams {
  search?: string;
  category?: string;
  brand?: string;
  collection?: string;
  color?: string;
  size?: string;
  sort?: string;
  min_price?: number;
  max_price?: number;
  featured?: boolean;
  page?: number;
  per_page?: number;
}

export interface ProductsResponse {
  products: Product[];
  pagination: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export const productsApi = {
  async getProducts(params?: ProductQueryParams): Promise<ProductsResponse> {
    const res: any = await apiClient('/products', { params });
    const products: Product[] = Array.isArray(res?.data)
      ? res.data
      : (Array.isArray(res?.data?.data) ? res.data.data : (res?.products || []));
    const pagination = res?.meta || res?.data?.meta || res?.pagination || {
      current_page: 1,
      last_page: 1,
      per_page: params?.per_page || 12,
      total: products.length,
    };
    return {
      products,
      pagination,
    };
  },

  async getProductBySlug(slug: string): Promise<ApiResponse<{ product: Product } | Product>> {
    return apiClient(`/products/${slug}`);
  },

  async getCategories(): Promise<ApiResponse<Category[] | { categories: Category[] }>> {
    return apiClient('/categories');
  },

  async getCategoryBySlug(slug: string): Promise<ApiResponse<{ category: Category } | Category>> {
    return apiClient(`/categories/${slug}`);
  },

  async getBrands(): Promise<ApiResponse<Brand[] | { brands: Brand[] }>> {
    return apiClient('/brands');
  },

  async getCollections(): Promise<ApiResponse<Collection[] | { collections: Collection[] }>> {
    return apiClient('/collections');
  },

  async getColors(): Promise<ApiResponse<ProductColor[] | { colors: ProductColor[] }>> {
    return apiClient('/colors');
  },

  async getSizes(): Promise<ApiResponse<ProductSize[] | { sizes: ProductSize[] }>> {
    return apiClient('/sizes');
  },

  async getMaterials(): Promise<ApiResponse<ProductMaterial[] | { materials: ProductMaterial[] }>> {
    return apiClient('/materials');
  },
};