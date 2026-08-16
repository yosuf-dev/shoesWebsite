import api, { isMock, mockDelay } from './api';
import { PRODUCTS, CATEGORIES, BRANDS, getProductBySlug, getProductById } from '../data/mockData';

/**
 * جستجو و فیلتر هوشمند محصولات
 */
export async function getProducts(params = {}) {
  if (isMock) {
    await mockDelay(400);
    let items = [...PRODUCTS];

    const {
      search, category, brand, color, size, gender, material,
      minPrice, maxPrice, availability, discount, sort, page = 1, perPage = 12,
    } = params;

    if (search) {
      const q = String(search).trim();
      items = items.filter(
        (p) =>
          p.name.includes(q) ||
          p.brand.name.includes(q) ||
          p.tags.some((t) => t.includes(q)) ||
          p.category.name.includes(q)
      );
    }
    if (category && category !== 'all') items = items.filter((p) => p.category.slug === category);
    if (brand && brand !== 'all') items = items.filter((p) => p.brand.slug === brand);
    if (gender && gender !== 'all') items = items.filter((p) => p.gender === gender);
    if (material && material !== 'all') items = items.filter((p) => p.material.includes(material));
    if (color && color !== 'all') items = items.filter((p) => p.colors.some((c) => c.hex === color));
    if (size) items = items.filter((p) => p.sizes.includes(Number(size)));
    if (minPrice) items = items.filter((p) => p.price >= Number(minPrice));
    if (maxPrice) items = items.filter((p) => p.price <= Number(maxPrice));
    if (availability === 'in-stock') items = items.filter((p) => p.stock > 0);
    if (availability === 'out-of-stock') items = items.filter((p) => p.stock === 0);
    if (discount) items = items.filter((p) => p.discountPercent > 0);
    if (params.newest) items = items.filter((p) => p.isNew);

    switch (sort) {
      case 'cheap':
        items.sort((a, b) => a.price - b.price);
        break;
      case 'expensive':
        items.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        items.sort((a, b) => b.rating - a.rating);
        break;
      case 'best-seller':
        items.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
      case 'discount':
        items.sort((a, b) => b.discountPercent - a.discountPercent);
        break;
      case 'newest':
        items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      default:
        break;
    }

    const total = items.length;
    const totalPages = Math.ceil(total / perPage);
    const start = (page - 1) * perPage;
    const data = items.slice(start, start + perPage);

    return {
      data,
      pagination: { total, totalPages, page, perPage, hasMore: page < totalPages },
    };
  }

  return api.get('/products', { params });
}

export async function getProduct(slug) {
  if (isMock) {
    await mockDelay(300);
    const product = getProductBySlug(slug);
    if (!product) return null;
    return {
      ...product,
      reviews: (await import('../data/mockData')).getProductReviews(product.id),
      related: PRODUCTS.filter(
        (p) => p.id !== product.id && p.category.slug === product.category.slug
      ).slice(0, 4),
    };
  }
  return api.get(`/products/${slug}`);
}

export async function getFeaturedProducts() {
  if (isMock) {
    await mockDelay(250);
    return PRODUCTS.filter((p) => p.featured).slice(0, 8);
  }
  return api.get('/products/featured');
}

export async function getCategories() {
  if (isMock) {
    await mockDelay(150);
    return CATEGORIES;
  }
  return api.get('/categories');
}

export async function getBrands() {
  if (isMock) {
    await mockDelay(150);
    return BRANDS;
  }
  return api.get('/brands');
}

export async function getRecommendedProducts(productId) {
  if (isMock) {
    await mockDelay(200);
    return PRODUCTS.filter((p) => p.id !== productId).sort((a, b) => b.rating - a.rating).slice(0, 4);
  }
  return api.get(`/products/${productId}/recommended`);
}

export async function getRecentlyViewed() {
  return api.get('/products/recently-viewed');
}

/** جستجوی زنده با پیشنهادهای آنی */
export async function liveSearch(query) {
  if (isMock) {
    await mockDelay(220);
    const q = String(query).trim();
    if (!q) return { products: [], brands: [], categories: [] };
    const products = PRODUCTS.filter(
      (p) =>
        p.name.includes(q) ||
        p.brand.name.includes(q) ||
        p.tags.some((t) => t.includes(q)) ||
        p.category.name.includes(q)
    ).slice(0, 6);
    const brands = BRANDS.filter((b) => b.name.includes(q)).slice(0, 3);
    const categories = CATEGORIES.filter((c) => c.name.includes(q)).slice(0, 3);
    return { products, brands, categories };
  }
  return api.get('/search', { params: { query: q } });
}

export async function getCompareProducts(ids) {
  if (isMock) {
    await mockDelay(200);
    return PRODUCTS.filter((p) => ids.includes(p.id));
  }
  return api.get('/products/compare', { params: { ids } });
}
