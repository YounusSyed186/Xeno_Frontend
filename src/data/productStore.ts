import { Product, Category, Collection, Brand, ProductColor, ProductSize, ProductMaterial } from '../types/product';
import { initialProducts, initialCategories, initialCollections, initialBrands, initialColors, initialSizes, initialMaterials } from './initialProducts';

const STORAGE_KEYS = {
  PRODUCTS: 'xenocraft_products_v3',
  CATEGORIES: 'xenocraft_categories_v3',
  COLLECTIONS: 'xenocraft_collections_v3',
  BRANDS: 'xenocraft_brands_v3',
  COLORS: 'xenocraft_colors_v3',
  SIZES: 'xenocraft_sizes_v3',
  MATERIALS: 'xenocraft_materials_v3',
};

function getStoredItem<T>(key: string, defaultVal: T): T {
  if (typeof window === 'undefined') return defaultVal;
  try {
    const item = localStorage.getItem(key);
    if (!item) {
      localStorage.setItem(key, JSON.stringify(defaultVal));
      return defaultVal;
    }
    return JSON.parse(item);
  } catch (e) {
    return defaultVal;
  }
}

function setStoredItem<T>(key: string, val: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (e) {
    console.error('Error saving to storage:', e);
  }
}

export const productStore = {
  getProducts(): Product[] {
    return getStoredItem<Product[]>(STORAGE_KEYS.PRODUCTS, []);
  },


  getProductById(id: number | string): Product | null {
    const products = this.getProducts();
    return products.find(p => String(p.id) === String(id)) || null;
  },

  getProductBySlug(slug: string): Product | null {
    const products = this.getProducts();
    return products.find(p => p.slug === slug) || null;
  },

  saveProduct(product: Partial<Product> & { id?: number }): Product {
    const products = this.getProducts();
    let saved: Product;
    if (product.id) {
      const idx = products.findIndex(p => p.id === product.id);
      if (idx !== -1) {
        saved = { ...products[idx], ...product } as Product;
        products[idx] = saved;
      } else {
        saved = { ...product, id: product.id } as Product;
        products.push(saved);
      }
    } else {
      const maxId = products.reduce((max, p) => Math.max(max, p.id || 0), 0);
      saved = {
        ...product,
        id: maxId + 1,
        slug: product.slug || (product.name ? product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') : `product-${maxId + 1}`),
        sku: product.sku || `XC-PROD-${maxId + 1}`,
        base_price: product.base_price || 499,
        status: product.status || 'active',
        is_featured: product.is_featured ?? false,
        moq: product.moq || 1,
      } as Product;
      products.unshift(saved);
    }
    setStoredItem(STORAGE_KEYS.PRODUCTS, products);
    return saved;
  },

  deleteProduct(id: number | string): boolean {
    const products = this.getProducts();
    const updated = products.filter(p => String(p.id) !== String(id));
    setStoredItem(STORAGE_KEYS.PRODUCTS, updated);
    return true;
  },

  duplicateProduct(id: number | string): Product | null {
    const original = this.getProductById(id);
    if (!original) return null;
    const { id: _ignoredId, ...rest } = original;
    const duplicated = {
      ...rest,
      name: `${original.name} (Copy)`,
      sku: `${original.sku}-COPY`,
      slug: `${original.slug}-copy-${Date.now()}`,
    };
    return this.saveProduct(duplicated);
  },

  getCategories(): Category[] {
    return getStoredItem<Category[]>(STORAGE_KEYS.CATEGORIES, initialCategories);
  },

  getCollections(): Collection[] {
    return getStoredItem<Collection[]>(STORAGE_KEYS.COLLECTIONS, initialCollections);
  },

  getBrands(): Brand[] {
    return getStoredItem<Brand[]>(STORAGE_KEYS.BRANDS, initialBrands);
  },

  getColors(): ProductColor[] {
    return getStoredItem<ProductColor[]>(STORAGE_KEYS.COLORS, initialColors);
  },

  getSizes(): ProductSize[] {
    return getStoredItem<ProductSize[]>(STORAGE_KEYS.SIZES, initialSizes);
  },

  getMaterials(): ProductMaterial[] {
    return getStoredItem<ProductMaterial[]>(STORAGE_KEYS.MATERIALS, initialMaterials);
  },
};
