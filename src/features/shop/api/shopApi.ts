import http from "@/shared/http";

export interface Shop {
  id: number;
  shop_name: string;
  description: string | null;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  phone_number: string | null;
  area_id: number | null;
  owner_id: string;
  logo_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ShopPayload {
  shop_name?: string;
  description?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  phone_number?: string;
  area_id?: number;
  logo?: File;
}

function toFormData(payload: ShopPayload): FormData {
  const form = new FormData();
  if (payload.shop_name !== undefined) form.append("shop_name", payload.shop_name);
  if (payload.description) form.append("description", payload.description);
  if (payload.address) form.append("address", payload.address);
  if (payload.latitude !== undefined) form.append("latitude", String(payload.latitude));
  if (payload.longitude !== undefined) form.append("longitude", String(payload.longitude));
  if (payload.phone_number) form.append("phone_number", payload.phone_number);
  if (payload.area_id !== undefined) form.append("area_id", String(payload.area_id));
  if (payload.logo) form.append("logo", payload.logo);
  return form;
}

export const shopApi = {
  async getAllShops(params: {
    limit?: number;
    offset?: number;
    search?: string;
    area_id?: number;
  } = {}): Promise<Shop[]> {
    const res = await http.get("/shops/", { params });
    return res.data;
  },

  async getMyShop(): Promise<Shop> {
    const res = await http.get("/shops/my-shop");
    return res.data;
  },

  async getShop(shopId: number): Promise<Shop> {
    const res = await http.get(`/shops/${shopId}`);
    return res.data;
  },

  async createShop(payload: ShopPayload & { shop_name: string }): Promise<Shop> {
    const res = await http.post("/shops/", toFormData(payload));
    return res.data;
  },

  async updateShop(shopId: number, payload: ShopPayload): Promise<Shop> {
    const res = await http.put(`/shops/${shopId}`, toFormData(payload));
    return res.data;
  },

  async deleteShop(shopId: number): Promise<void> {
    await http.delete(`/shops/${shopId}`);
  },

  async getAreas(): Promise<Area[]> {
    const res = await http.get("/areas/");
    return res.data;
  },
};

export interface Area {
  id: number;
  area_name: string;
  city_name: string;
}

export type CreateShopPayload = ShopPayload & { shop_name: string };