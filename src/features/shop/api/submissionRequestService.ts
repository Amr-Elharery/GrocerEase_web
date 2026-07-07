import http from "@/shared/http";

export interface ProductRequest {
  id: number;
  shop_id: number;
  requested_by: string;
  name: string;
  description: string;
  brand: string;
  unit: string;
  category_id: number;
  subcategory_id: number | null;
  status: string;
  image_url: string | null;
  created_at: string;
}

export interface CreateProductRequestPayload {
  shop_id: number;
  name: string;
  description: string;
  brand: string;
  unit: string;
  category_id: number;
  subcategory_id?: number;
  image?: File;
}

export const productRequestService = {
  async getAll(params: { status?: string; shop_id?: number; limit?: number; offset?: number } = {}): Promise<ProductRequest[]> {
    const res = await http.get("/product-requests/", { params });
    return res.data;
  },

  async getOne(id: number): Promise<ProductRequest> {
    const res = await http.get(`/product-requests/${id}`);
    return res.data;
  },

  async create(payload: CreateProductRequestPayload): Promise<ProductRequest> {
    const form = new FormData();
    form.append("shop_id", String(payload.shop_id));
    form.append("name", payload.name);
    form.append("description", payload.description);
    form.append("brand", payload.brand);
    form.append("unit", payload.unit);
    form.append("category_id", String(payload.category_id));
    if (payload.subcategory_id !== undefined) {
      form.append("subcategory_id", String(payload.subcategory_id));
    }
    if (payload.image) form.append("image", payload.image);

    const res = await http.post("/product-requests/", form);
    return res.data;
  },

  async approve(id: number): Promise<ProductRequest> {
    const res = await http.patch(`/product-requests/${id}/approve`);
    return res.data;
  },

  async reject(id: number): Promise<ProductRequest> {
    const res = await http.patch(`/product-requests/${id}/reject`);
    return res.data;
  },
};