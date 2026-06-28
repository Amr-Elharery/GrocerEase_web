import { z } from "zod";
import http from "@/shared/http";

export const ShopProductSchema = z.object({
  product_id: z.string(),
  product_name: z.string(),
  category_name: z.string(),
  category_id: z.string(),
  sub_category_name: z.string(),
  sub_category_id: z.string(),
  price: z.number(),
  available_stock: z.number(),
  low_stock_threshold: z.number().optional(),
  image_url: z.string().nullable().optional(),
  is_active: z.boolean(),
  is_available: z.boolean().optional(),
  brand: z.string().optional(),
  unit: z.string().optional(),
});

export const ShopProductsResponseSchema = z.object({
  data: z.array(ShopProductSchema),
  total: z.number(),
  page: z.number(),
  limit: z.number(),
});

export type ShopProduct = z.infer<typeof ShopProductSchema>;
export type ShopProductsResponse = z.infer<typeof ShopProductsResponseSchema>;

export type CatalogProduct = {
  product_id: string;
  product_name: string;
  category_name: string;
  category_id: string;
  sub_category_name: string;
  sub_category_id: string;
  brand: string;
  unit: string;
  image_url: string | null;
};

const PAGE_SIZE = 25;

interface ApiShopProduct {
  id: number;
  shop_id: number;
  product_id: number;
  price: number;
  available_stock: number;
  low_stock_threshold: number;
  is_active: boolean;
  is_available?: boolean;
  product?: {
    id: number;
    product_name: string;
    description?: string | null;
    brand?: string | null;
    unit?: string | null;
    product_images?: { id: number; image_url: string | null; is_primary: boolean }[];
  };
}

type CatInfo = { category_name: string; category_id: string; sub_category_name: string; sub_category_id: string };

function mapShopProduct(item: ApiShopProduct, catLookup?: Map<number, CatInfo>): ShopProduct {
  const cat = item.product?.id != null ? catLookup?.get(item.product.id) : undefined;
  const images = item.product?.product_images ?? [];
  const primary = images.find((img) => img.is_primary) ?? images[0];
  return {
    product_id: String(item.id),
    product_name: item.product?.product_name ?? "",
    category_name: cat?.category_name ?? "",
    category_id: cat?.category_id ?? "",
    sub_category_name: cat?.sub_category_name ?? "",
    sub_category_id: cat?.sub_category_id ?? "",
    price: item.price,
    available_stock: item.available_stock,
    low_stock_threshold: item.low_stock_threshold,
    image_url: primary?.image_url ?? null,
    is_active: item.is_active,
    is_available: item.is_available,
    brand: item.product?.brand ?? undefined,
    unit: item.product?.unit ?? undefined,
  };
}

async function buildCategoryLookup(): Promise<Map<number, CatInfo>> {
  const map = new Map<number, CatInfo>();
  try {
    const res = await http.get("/products/", { params: { limit: 100, offset: 0 } });
    for (const p of res.data ?? []) {
      map.set(p.id, {
        category_name: p.category?.category_name ?? "",
        category_id: p.category?.id != null ? String(p.category.id) : "",
        sub_category_name: p.sub_category?.category_name ?? "",
        sub_category_id: p.sub_category?.id != null ? String(p.sub_category.id) : "",
      });
    }
  } catch {
    //
  }
  return map;
}

export const shopService = {
  async getShopProducts(shopId: string, page: number = 1): Promise<ShopProductsResponse> {
    if (!shopId) {
      return { data: [], total: 0, page, limit: PAGE_SIZE };
    }
    const res = await http.get("/shop-products/manage", {
      params: {
        shop_id: Number(shopId),
        limit: PAGE_SIZE,
        offset: (page - 1) * PAGE_SIZE,
      },
    });
    const items: ApiShopProduct[] = res.data ?? [];
    const catLookup = await buildCategoryLookup();
    const data = items.map((item) => mapShopProduct(item, catLookup));
    const total = (page - 1) * PAGE_SIZE + data.length + (data.length === PAGE_SIZE ? PAGE_SIZE : 0);
    return { data, total, page, limit: PAGE_SIZE };
  },

  async getAvailableProducts(_shopId: string, search: string = "", categoryId: string = ""): Promise<CatalogProduct[]> {
    const res = await http.get("/products/", {
      params: {
        limit: 50,
        offset: 0,
        ...(search ? { search } : {}),
      },
    });
    const products = res.data ?? [];
    return products
      .map((p: {
        id: number;
        product_name: string;
        brand?: string | null;
        unit?: string | null;
        category?: { id: number; category_name: string } | null;
        sub_category?: { id: number; category_name: string } | null;
        product_images?: { image_url: string | null; is_primary: boolean }[];
      }): CatalogProduct => {
        const imgs = p.product_images ?? [];
        const primary = imgs.find((i) => i.is_primary) ?? imgs[0];
        return {
          product_id: String(p.id),
          product_name: p.product_name,
          category_name: p.category?.category_name ?? "",
          category_id: p.category?.id != null ? String(p.category.id) : "",
          sub_category_name: p.sub_category?.category_name ?? "",
          sub_category_id: p.sub_category?.id != null ? String(p.sub_category.id) : "",
          brand: p.brand ?? "",
          unit: p.unit ?? "",
          image_url: primary?.image_url ?? null,
        };
      })
      .filter((p: CatalogProduct) => !categoryId || p.category_id === categoryId);
  },

  async addShopProduct(shopId: string, payload: {
    product_id: string;
    price: number;
    available_stock: number;
    low_stock_threshold: number;
  }): Promise<ShopProduct> {
    const res = await http.post("/shop-products/", {
      shop_id: Number(shopId),
      product_id: Number(payload.product_id),
      price: payload.price,
      available_stock: payload.available_stock,
      low_stock_threshold: payload.low_stock_threshold,
    });
    return mapShopProduct(res.data);
  },

  async updateShopProduct(_shopId: string, productId: string, payload: { price?: number; available_stock?: number; low_stock_threshold?: number }): Promise<ShopProduct> {
    const res = await http.put(`/shop-products/${productId}`, {
      ...(payload.price !== undefined ? { price: payload.price } : {}),
      ...(payload.available_stock !== undefined ? { available_stock: payload.available_stock } : {}),
      ...(payload.low_stock_threshold !== undefined ? { low_stock_threshold: payload.low_stock_threshold } : {}),
    });
    return mapShopProduct(res.data);
  },

  async markAvailable(productId: string): Promise<ShopProduct> {
    const res = await http.patch(`/shop-products/${productId}/mark-available`);
    return mapShopProduct(res.data);
  },

  async markUnavailable(productId: string): Promise<ShopProduct> {
    const res = await http.patch(`/shop-products/${productId}/mark-unavailable`);
    return mapShopProduct(res.data);
  },

  async deleteShopProduct(productId: string): Promise<void> {
    await http.delete(`/shop-products/${productId}`);
  },
};