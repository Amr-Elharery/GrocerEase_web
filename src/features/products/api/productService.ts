import { z } from "zod";
import http from "@/shared/http";

export const ProductSchema = z.object({
  id: z.number(),
  product_name: z.string(),
  brand: z.string().nullable().optional(),
  unit: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  category: z.object({
    id: z.number(),
    category_name: z.string(),
  }).nullable().optional(),
  sub_category: z.object({
    id: z.number(),
    category_name: z.string(),
  }).nullable().optional(),
  product_images: z.array(z.object({
    id: z.number(),
    image_url: z.string().nullable(),
    is_primary: z.boolean(),
    variant: z.string().nullable(),
  })).optional(),
});

export const ProductsResponseSchema = z.array(ProductSchema);

export const CreateProductSchema = z.object({
  product_name: z.string().min(2, "Product name must be at least 2 characters"),
  category_id: z.coerce.number().int().min(1, "Category is required"),
  sub_category_id: z.preprocess(
    (v) => (v === "" || v === null || v === undefined || Number(v) === 0 ? undefined : Number(v)),
    z.number().int().optional()
  ),
  brand: z.string().optional(),
  unit: z.string().optional(),
  description: z.string().optional(),
});

export const UpdateProductSchema = CreateProductSchema;

export type Product = z.infer<typeof ProductSchema>;
export type ProductsResponse = Product[];
export type CreateProductInput = z.infer<typeof CreateProductSchema>;
export type UpdateProductInput = z.infer<typeof UpdateProductSchema>;

export interface GetProductsParams {
  limit?: number;
  offset?: number;
  search?: string;
}

function buildProductFormData(input: CreateProductInput, files: File[]): FormData {
  const fd = new FormData();
  fd.append("product_name", input.product_name);
  fd.append("category_id", String(input.category_id));
  if (input.sub_category_id) {
    fd.append("sub_category_id", String(input.sub_category_id));
  }
  if (input.brand) fd.append("brand", input.brand);
  if (input.unit) fd.append("unit", input.unit);
  if (input.description) fd.append("description", input.description);
  files.forEach((file) => fd.append("files", file));
  return fd;
}

export const productService = {
  async getProducts(params: GetProductsParams = {}): Promise<ProductsResponse> {
    const res = await http.get("/products/", {
      params: {
        limit: params.limit ?? 10,
        offset: params.offset ?? 0,
        ...(params.search ? { search: params.search } : {}),
      },
    });
    const parsed = ProductsResponseSchema.safeParse(res.data);
    if (!parsed.success) throw new Error("Invalid products data");
    return parsed.data;
  },

  async getProduct(id: string): Promise<Product> {
    const res = await http.get(`/products/${id}`);
    const parsed = ProductSchema.safeParse(res.data);
    if (!parsed.success) throw new Error(parsed.error.issues[0].message);
    return parsed.data;
  },

  async createProduct(payload: unknown, files: File[]): Promise<string> {
    const parsed = CreateProductSchema.safeParse(payload);
    if (!parsed.success) throw new Error(parsed.error.issues[0].message);
    if (files.length === 0) throw new Error("At least one image is required");
    const res = await http.post("/products/", buildProductFormData(parsed.data, files));
    return res.data;
  },

  async updateProduct(id: string, payload: unknown, files: File[] = []): Promise<Product> {
    const parsed = UpdateProductSchema.safeParse(payload);
    if (!parsed.success) throw new Error(parsed.error.issues[0].message);
    const res = await http.put(`/products/${id}`, buildProductFormData(parsed.data, files));
    return res.data;
  },

  async deleteProduct(id: string): Promise<void> {
    await http.delete(`/products/${id}`);
  },

  async deleteProductImage(productId: string, imageId: string): Promise<void> {
    await http.delete(`/products/${productId}/images/${imageId}`);
  },

  async makePrimaryImage(productId: string, imageId: string): Promise<void> {
    await http.post(`/products/${productId}/images/${imageId}/make-primary`);
  },
};