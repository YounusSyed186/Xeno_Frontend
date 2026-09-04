import { useQuery } from '@tanstack/react-query';
import { productsApi, ProductQueryParams, ProductsResponse } from '../api/products.api';

export function useFeaturedProducts(params?: ProductQueryParams) {
  return useProducts({ ...params, featured: true });
}

export function useProducts(params?: ProductQueryParams) {
  return useQuery({
    queryKey: ['products', params],
    queryFn: async (): Promise<ProductsResponse> => {
      return productsApi.getProducts(params);
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useProduct(slug: string) {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: async () => {
      const res: any = await productsApi.getProductBySlug(slug);
      return res?.data?.product || res?.data || res || null;
    },
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res: any = await productsApi.getCategories();
      const list = Array.isArray(res?.data)
        ? res.data
        : (Array.isArray(res?.data?.categories) ? res.data.categories : (Array.isArray(res) ? res : []));
      return list;
    },
    staleTime: 10 * 60 * 1000,
  });
}

export function useBrands() {
  return useQuery({
    queryKey: ['brands'],
    queryFn: async () => {
      const res: any = await productsApi.getBrands();
      const list = Array.isArray(res?.data)
        ? res.data
        : (Array.isArray(res?.data?.brands) ? res.data.brands : (Array.isArray(res) ? res : []));
      return list;
    },
    staleTime: 10 * 60 * 1000,
  });
}

export function useCollections() {
  return useQuery({
    queryKey: ['collections'],
    queryFn: async () => {
      const res: any = await productsApi.getCollections();
      const list = Array.isArray(res?.data)
        ? res.data
        : (Array.isArray(res?.data?.collections) ? res.data.collections : (Array.isArray(res) ? res : []));
      return list;
    },
    staleTime: 10 * 60 * 1000,
  });
}

export function useColors() {
  return useQuery({
    queryKey: ['colors'],
    queryFn: async () => {
      const res: any = await productsApi.getColors();
      const list = Array.isArray(res?.data)
        ? res.data
        : (Array.isArray(res?.data?.colors) ? res.data.colors : (Array.isArray(res) ? res : []));
      return list;
    },
    staleTime: 10 * 60 * 1000,
  });
}

export function useSizes() {
  return useQuery({
    queryKey: ['sizes'],
    queryFn: async () => {
      const res: any = await productsApi.getSizes();
      const list = Array.isArray(res?.data)
        ? res.data
        : (Array.isArray(res?.data?.sizes) ? res.data.sizes : (Array.isArray(res) ? res : []));
      return list;
    },
    staleTime: 10 * 60 * 1000,
  });
}

export function useMaterials() {
  return useQuery({
    queryKey: ['materials'],
    queryFn: async () => {
      const res: any = await productsApi.getMaterials();
      const list = Array.isArray(res?.data)
        ? res.data
        : (Array.isArray(res?.data?.materials) ? res.data.materials : (Array.isArray(res) ? res : []));
      return list;
    },
    staleTime: 10 * 60 * 1000,
  });
}