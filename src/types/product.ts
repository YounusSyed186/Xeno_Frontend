export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  image_url?: string | null;
  parent_id?: number | null;
  is_active: boolean;
}

export interface Brand {
  id: number;
  name: string;
  slug: string;
  logo_url?: string | null;
  is_active: boolean;
}

export interface Collection {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  banner_url?: string | null;
  is_active: boolean;
}

export interface ProductColor {
  id: number;
  name: string;
  hex_code?: string;
}

export interface ProductSize {
  id: number;
  name: string;
  code?: string;
}

export interface ProductMaterial {
  id: number;
  name: string;
}

export interface ProductImage {
  id?: number;
  product_id?: number;
  url: string;
  cloudinary_public_id?: string | null;
  width?: number | null;
  height?: number | null;
  format?: string | null;
  bytes?: number | null;
  alt_text?: string | null;
  sort_order?: number;
  is_primary?: boolean;
}

export interface ProductVariant {
  id: number;
  product_id: number;
  sku: string;
  color_id?: number | null;
  size_id?: number | null;
  material_id?: number | null;
  price_adjustment?: number;
  stock_quantity: number;
  stock_status: 'in_stock' | 'low_stock' | 'out_of_stock';
  is_active: boolean;
  color?: ProductColor;
  size?: ProductSize;
  material?: ProductMaterial;
}

export interface PriceTier {
  id: number;
  product_id: number;
  min_quantity: number;
  max_quantity?: number | null;
  unit_price: number;
  is_active: boolean;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  sku: string;
  short_description?: string | null;
  description?: string | null;
  base_price: number;
  compare_at_price?: number | null;
  status: 'active' | 'draft' | 'archived';
  is_featured: boolean;
  moq: number;
  category_id?: number | null;
  brand_id?: number | null;
  collection_id?: number | null;
  category?: Category;
  brand?: Brand;
  collection?: Collection;
  images?: ProductImage[];
  variants?: ProductVariant[];
  price_tiers?: PriceTier[];
  average_rating?: number;
  reviews_count?: number;
  created_at: string;
  updated_at: string;
}

export interface PrintingMethod {
  id: number;
  name: string;
  code: string;
  description?: string | null;
  setup_fee: number;
  is_active: boolean;
}

export interface CustomizationOption {
  id: number;
  name: string;
  code: string;
  type: string;
  is_active: boolean;
}

export interface DesignUpload {
  id: number;
  user_id: number;
  original_name: string;
  path: string;
  mime_type: string;
  extension: string;
  size_bytes: number;
  metadata?: any;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}
