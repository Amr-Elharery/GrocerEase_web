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
  brand: z.string().min(1, "Brand is required"),
  description: z.string().optional(),
  barcode: z.string().min(1, "Barcode is required"),
  unit: z.string().min(1, "Unit is required"),
  category_id: z.string().min(1, "Category is required"),
  sub_category_id: z.string().min(1, "Sub-category is required"),
});

export const UpdateProductSchema = z.object({
  product_name: z.string().min(2, "Product name must be at least 2 characters"),
  brand: z.string().min(1, "Brand is required"),
  description: z.string().optional(),
  barcode: z.string().min(1, "Barcode is required"),
  unit: z.string().min(1, "Unit is required"),
  category_id: z.string().min(1, "Category is required"),
  sub_category_id: z.string().min(1, "Sub-category is required"),
});

export type Product = z.infer<typeof ProductSchema>;
export type ProductsResponse = Product[];
export type CreateProductInput = z.infer<typeof CreateProductSchema>;
export type UpdateProductInput = z.infer<typeof UpdateProductSchema>;

export const productService = {
  async getProducts(): Promise<ProductsResponse> {
    const res = await http.get("/products/");
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

  async createProduct(payload: unknown): Promise<Product> {
    const parsed = CreateProductSchema.safeParse(payload);
    if (!parsed.success) throw new Error(parsed.error.issues[0].message);
    const res = await http.post("/products/", parsed.data);
    return res.data;
  },

  async updateProduct(id: string, payload: unknown): Promise<Product> {
    const parsed = UpdateProductSchema.safeParse(payload);
    if (!parsed.success) throw new Error(parsed.error.issues[0].message);
    const res = await http.put(`/products/${id}`, parsed.data);
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