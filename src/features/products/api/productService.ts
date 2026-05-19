import { z } from "zod";

export const ProductSchema = z.object({
  product_name: z.string(),
  brand: z.string(),
  category_name: z.string(),
  category_id: z.string().optional(),
  sub_category_name: z.string(),
  sub_category_id: z.string().optional(),
  barcode: z.string(),
  unit: z.string(),
  description: z.string().optional(),
  created_at: z.string(),
  updated_at: z.string().optional(),
  stores_count: z.number(),
});

export const ProductsResponseSchema = z.object({
  data: z.array(ProductSchema),
  total: z.number(),
  page: z.number(),
  limit: z.number(),
});

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
export type ProductsResponse = z.infer<typeof ProductsResponseSchema>;
export type CreateProductInput = z.infer<typeof CreateProductSchema>;
export type UpdateProductInput = z.infer<typeof UpdateProductSchema>;

const products = [
  { product_name: "Full Cream Milk 1L", brand: "Juhayna", category_name: "Dairy", category_id: "1", sub_category_name: "Milk", sub_category_id: "1-1", unit: "Piece" },
  { product_name: "Labneh Spreadable 500g", brand: "Panda", category_name: "Dairy", category_id: "1", sub_category_name: "Cheese", sub_category_id: "1-2", unit: "Pack" },
  { product_name: "Egyptian White Rice 2kg", brand: "Abu Kass", category_name: "Grains", category_id: "2", sub_category_name: "Rice", sub_category_id: "2-1", unit: "Bag" },
  { product_name: "Sunflower Oil 1.5L", brand: "Hayat", category_name: "Oils", category_id: "6", sub_category_name: "Cooking Oil", sub_category_id: "6-1", unit: "Bottle" },
  { product_name: "Pita Bread 8 Pieces", brand: "Americana", category_name: "Bakery", category_id: "7", sub_category_name: "Bread", sub_category_id: "7-1", unit: "Pack" },
  { product_name: "Tomato Paste 135g", brand: "Heinz", category_name: "Canned Goods", category_id: "8", sub_category_name: "Paste", sub_category_id: "8-1", unit: "Can" },
  { product_name: "Chicken Breast 1kg", brand: "Koki", category_name: "Meat", category_id: "5", sub_category_name: "Poultry", sub_category_id: "5-1", unit: "Kg" },
  { product_name: "Eggs 30 Pieces", brand: "Domty", category_name: "Dairy", category_id: "1", sub_category_name: "Eggs", sub_category_id: "1-4", unit: "Tray" },
  { product_name: "Cheddar Cheese 400g", brand: "Domty", category_name: "Dairy", category_id: "1", sub_category_name: "Cheese", sub_category_id: "1-2", unit: "Pack" },
  { product_name: "Pasta Penne 500g", brand: "Barilla", category_name: "Grains", category_id: "2", sub_category_name: "Pasta", sub_category_id: "2-2", unit: "Pack" },
  { product_name: "Green Tea 25 Bags", brand: "Lipton", category_name: "Beverages", category_id: "3", sub_category_name: "Tea", sub_category_id: "3-3", unit: "Box" },
  { product_name: "Instant Coffee 200g", brand: "Nescafe", category_name: "Beverages", category_id: "3", sub_category_name: "Coffee", sub_category_id: "3-4", unit: "Jar" },
  { product_name: "Orange Juice 1L", brand: "Minute Maid", category_name: "Beverages", category_id: "3", sub_category_name: "Juice", sub_category_id: "3-1", unit: "Carton" },
  { product_name: "Mineral Water 1.5L", brand: "Baraka", category_name: "Beverages", category_id: "3", sub_category_name: "Water", sub_category_id: "3-2", unit: "Bottle" },
  { product_name: "Dark Chocolate 100g", brand: "Cadbury", category_name: "Snacks", category_id: "4", sub_category_name: "Chocolate", sub_category_id: "4-2", unit: "Piece" },
  { product_name: "Potato Chips 160g", brand: "Chipsy", category_name: "Snacks", category_id: "4", sub_category_name: "Chips", sub_category_id: "4-1", unit: "Bag" },
  { product_name: "Biscuits 200g", brand: "LU", category_name: "Snacks", category_id: "4", sub_category_name: "Biscuits", sub_category_id: "4-3", unit: "Pack" },
  { product_name: "Yogurt Plain 170g", brand: "Juhayna", category_name: "Dairy", category_id: "1", sub_category_name: "Yogurt", sub_category_id: "1-3", unit: "Cup" },
  { product_name: "Frozen Peas 400g", brand: "Americana", category_name: "Frozen", category_id: "9", sub_category_name: "Vegetables", sub_category_id: "9-1", unit: "Bag" },
  { product_name: "Tuna Can 185g", brand: "California Garden", category_name: "Canned Goods", category_id: "8", sub_category_name: "Fish", sub_category_id: "8-2", unit: "Can" },
  { product_name: "Honey 500g", brand: "Bee Natural", category_name: "Spreads", category_id: "10", sub_category_name: "Honey", sub_category_id: "10-1", unit: "Jar" },
  { product_name: "Ketchup 500ml", brand: "Heinz", category_name: "Condiments", category_id: "11", sub_category_name: "Sauces", sub_category_id: "11-1", unit: "Bottle" },
  { product_name: "Mayonnaise 400g", brand: "Hellmann's", category_name: "Condiments", category_id: "11", sub_category_name: "Sauces", sub_category_id: "11-1", unit: "Jar" },
  { product_name: "Sugar 1kg", brand: "Delta", category_name: "Baking", category_id: "12", sub_category_name: "Sugar", sub_category_id: "12-1", unit: "Bag" },
  { product_name: "Salt 750g", brand: "Ras El Bar", category_name: "Baking", category_id: "12", sub_category_name: "Salt", sub_category_id: "12-2", unit: "Pack" },
];

export const productService = {
  async getProducts(page: number = 1): Promise<ProductsResponse> {
    const startIndex = (page - 1) * 25;
    const raw = {
      data: Array.from({ length: 25 }, (_, i) => ({
        ...products[i % products.length],
        barcode: `${745920381442 + startIndex + i}`,
        created_at: new Date(Date.now() - (startIndex + i) * 86400000).toISOString(),
        stores_count: Math.floor(Math.random() * 32) + 1,
      })),
      total: 12482,
      page,
      limit: 25,
    };

    const parsed = ProductsResponseSchema.safeParse(raw);
    if (!parsed.success) throw new Error("Invalid products data: " + parsed.error.issues[0].message);
    return parsed.data;
  },

  async getProduct(id: string): Promise<Product> {
    // TODO: replace with real API call
    // const res = await http.get(`/products/${id}`);
    // return res.data;

    const mock = {
      product_name: "Full Cream Milk 1L",
      brand: "Juhayna",
      category_name: "Dairy",
      category_id: "1",
      sub_category_name: "Milk",
      sub_category_id: "1-1",
      barcode: `74592038${id}`,
      unit: "Piece",
      description: "Fresh full cream milk",
      created_at: new Date(Date.now() - 30 * 86400000).toISOString(),
      updated_at: new Date(Date.now() - 5 * 86400000).toISOString(),
      stores_count: 12,
    };

    const parsed = ProductSchema.safeParse(mock);
    if (!parsed.success) throw new Error(parsed.error.issues[0].message);
    return parsed.data;
  },

  async updateProduct(id: string, payload: unknown): Promise<Product> {
    const parsed = UpdateProductSchema.safeParse(payload);
    if (!parsed.success) throw new Error(parsed.error.issues[0].message);

    // TODO: replace with real API call
    // const res = await http.put(`/products/${id}`, parsed.data);
    // return res.data;

    return {
      product_name: parsed.data.product_name,
      brand: parsed.data.brand,
      category_name: "Mock Category",
      sub_category_name: "Mock Sub Category",
      barcode: parsed.data.barcode,
      unit: parsed.data.unit,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      stores_count: 12,
    };
  },

  async createProduct(payload: unknown): Promise<Product> {
    const parsed = CreateProductSchema.safeParse(payload);
    if (!parsed.success) throw new Error(parsed.error.issues[0].message);

    // TODO: replace with real API call
    // const res = await http.post('/products', parsed.data);
    // return res.data;

    return {
      product_name: parsed.data.product_name,
      brand: parsed.data.brand,
      category_name: "Mock Category",
      sub_category_name: "Mock Sub Category",
      barcode: parsed.data.barcode,
      unit: parsed.data.unit,
      created_at: new Date().toISOString(),
      stores_count: 0,
    };
  },
};