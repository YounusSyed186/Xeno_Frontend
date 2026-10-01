import { apiClient } from './client';
import { Product, Category, Brand, Collection, ProductColor, ProductSize, ProductMaterial } from '../types/product';
import { ApiResponse } from '../types/api';
import { productStore } from '../data/productStore';

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
    try {
      const res: any = await apiClient('/products', { params });
      const products: Product[] = Array.isArray(res?.data)
        ? res.data
        : (Array.isArray(res?.data?.data) ? res.data.data : (res?.products || []));
      
      const pagination = res?.meta || res?.data?.meta || res?.pagination || {
        current_page: params?.page || 1,
        last_page: 1,
        per_page: params?.per_page || 12,
        total: products.length,
      };
      return { products, pagination };
    } catch (err) {
      console.error('Failed to load products from API:', err);
      throw err;
    }
  },

  async getProductBySlug(slug: string): Promise<ApiResponse<{ product: Product } | Product>> {
    const res = await apiClient(`/products/${slug}`);
    return res as any;
  },

  async getCategories(): Promise<ApiResponse<Category[] | { categories: Category[] }>> {
    try {
      const res = await apiClient('/categories');
      if (res?.data) return res as any;
    } catch (e) {}
    return { success: true, data: productStore.getCategories(), message: 'Categories loaded' } as any;
  },

  async getCategoryBySlug(slug: string): Promise<ApiResponse<{ category: Category } | Category>> {
    try {
      const res = await apiClient(`/categories/${slug}`);
      if (res?.data) return res as any;
    } catch (e) {}
    const c = productStore.getCategories().find(cat => cat.slug === slug);
    return { success: !!c, data: c || null, message: c ? 'Category found' : 'Not found' } as any;
  },

  async getBrands(): Promise<ApiResponse<Brand[] | { brands: Brand[] }>> {
    try {
      const res = await apiClient('/brands');
      if (res?.data) return res as any;
    } catch (e) {}
    return { success: true, data: productStore.getBrands(), message: 'Brands loaded' } as any;
  },

  async getCollections(): Promise<ApiResponse<Collection[] | { collections: Collection[] }>> {
    try {
      const res = await apiClient('/collections');
      if (res?.data) return res as any;
    } catch (e) {}
    return { success: true, data: productStore.getCollections(), message: 'Collections loaded' } as any;
  },

  async getColors(): Promise<ApiResponse<ProductColor[] | { colors: ProductColor[] }>> {
    try {
      const res = await apiClient('/colors');
      if (res?.data) return res as any;
    } catch (e) {}
    return { success: true, data: productStore.getColors(), message: 'Colors loaded' } as any;
  },

  async getSizes(): Promise<ApiResponse<ProductSize[] | { sizes: ProductSize[] }>> {
    try {
      const res = await apiClient('/sizes');
      if (res?.data) return res as any;
    } catch (e) {}
    return { success: true, data: productStore.getSizes(), message: 'Sizes loaded' } as any;
  },

  async getMaterials(): Promise<ApiResponse<ProductMaterial[] | { materials: ProductMaterial[] }>> {
    try {
      const res = await apiClient('/materials');
      if (res?.data) return res as any;
    } catch (e) {}
    return { success: true, data: productStore.getMaterials(), message: 'Materials loaded' } as any;
  },
};