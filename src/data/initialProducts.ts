import { Product, Category, Brand, Collection, ProductColor, ProductSize, ProductMaterial } from '../types/product';

export const initialCategories: Category[] = [
  {
    id: 1,
    name: 'T-Shirts',
    slug: 't-shirts',
    description: 'Custom printed and embroidered classic t-shirts',
    parent_id: null,
    is_active: true,
  },
  {
    id: 2,
    name: 'Oversized T-Shirts',
    slug: 'oversized-tshirts',
    description: 'Heavyweight boxy drop-shoulder custom streetwear t-shirts',
    parent_id: null,
    is_active: true,
  },
  {
    id: 3,
    name: 'Sports & Dry-Fit',
    slug: 'sports-tshirts',
    description: 'Breathable athletic performance custom t-shirts and jerseys',
    parent_id: null,
    is_active: true,
  },
  {
    id: 4,
    name: 'Polo Shirts',
    slug: 'polos',
    description: 'Corporate and casual embroidered polo shirts',
    parent_id: null,
    is_active: true,
  },
];

export const initialCollections: Collection[] = [
  {
    id: 1,
    name: 'Streetwear Collection',
    slug: 'streetwear-drop',
    description: 'Heavyweight boxy cuts, aesthetic graphics, and urban culture vibes',
    is_active: true,
  },
  {
    id: 2,
    name: 'Summer Essentials',
    slug: 'summer-collection',
    description: 'Lightweight, breathable custom merchandise for warm weather',
    is_active: true,
  },
  {
    id: 3,
    name: 'Winter & Heavyweight',
    slug: 'winter-collection',
    description: 'Warm, cozy heavyweight 240+ GSM apparel and fleece',
    is_active: true,
  },
  {
    id: 4,
    name: 'Corporate Swag & Merch',
    slug: 'corporate-gifting',
    description: 'Premium branded merchandise for teams, launches, and events',
    is_active: true,
  },
];

export const initialBrands: Brand[] = [
  {
    id: 1,
    name: 'Xeno Craft',
    slug: 'xeno-craft',
    logo_url: null,
    is_active: true,
  },
];

export const initialColors: ProductColor[] = [
  { id: 1, name: 'Pitch Black', hex_code: '#0d0d0d' },
  { id: 2, name: 'Off White', hex_code: '#f5f5f0' },
  { id: 3, name: 'Midnight Navy', hex_code: '#0f1f38' },
  { id: 4, name: 'Charcoal', hex_code: '#2b2d42' },
  { id: 5, name: 'Terracotta Rust', hex_code: '#c85a32' },
  { id: 6, name: 'Burnt Orange', hex_code: '#d95d39' },
  { id: 7, name: 'Stone Beige', hex_code: '#d4b996' },
  { id: 8, name: 'Butter Cream', hex_code: '#f4ebd0' },
  { id: 9, name: 'Earthy Taupe', hex_code: '#8d7b68' },
  { id: 10, name: 'Olive Green', hex_code: '#4a5d4e' },
  { id: 11, name: 'Heather Gray', hex_code: '#9ca3af' },
  { id: 12, name: 'Royal Blue', hex_code: '#1d4ed8' },
];

export const initialSizes: ProductSize[] = [
  { id: 1, name: 'XS', code: 'xs' },
  { id: 2, name: 'Small', code: 's' },
  { id: 3, name: 'Medium', code: 'm' },
  { id: 4, name: 'Large', code: 'l' },
  { id: 5, name: 'XL', code: 'xl' },
  { id: 6, name: '2XL', code: '2xl' },
  { id: 7, name: '3XL', code: '3xl' },
];

export const initialMaterials: ProductMaterial[] = [
  { id: 1, name: 'Heavyweight Combed Cotton (240 GSM)' },
  { id: 2, name: '100% Combed Cotton (180 GSM)' },
  { id: 3, name: 'Dry-Fit Performance Poly' },
  { id: 4, name: 'Cotton-Poly Pique Blend' },
];

export const initialProducts: Product[] = [];

