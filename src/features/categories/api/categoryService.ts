import { z } from "zod";

export const CategorySchema = z.object({
  id: z.string(),
  name: z.string(),
  parent_id: z.string().nullable(),
  slug: z.string().optional(),
  description: z.string().optional(),
  product_count: z.number(),
});

export const CreateCategorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  parent_id: z.string().nullable(),
  slug: z.string().optional(),
  description: z.string().optional(),
});

export const UpdateCategorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().optional(),
  description: z.string().optional(),
});

export type Category = z.infer<typeof CategorySchema>;
export type CreateCategoryInput = z.infer<typeof CreateCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof UpdateCategorySchema>;

const mockCategories: Category[] = [
  { id: "1", name: "Dairy", parent_id: null, slug: "dairy", description: "Dairy products", product_count: 120 },
  { id: "2", name: "Grains", parent_id: null, slug: "grains", description: "Grains and cereals", product_count: 85 },
  { id: "3", name: "Beverages", parent_id: null, slug: "beverages", description: "Drinks and beverages", product_count: 200 },
  { id: "4", name: "Snacks", parent_id: null, slug: "snacks", description: "Snacks and treats", product_count: 150 },
  { id: "5", name: "Meat", parent_id: null, slug: "meat", description: "Meat and poultry", product_count: 60 },
  { id: "1-1", name: "Milk", parent_id: "1", slug: "milk", product_count: 30 },
  { id: "1-2", name: "Cheese", parent_id: "1", slug: "cheese", product_count: 45 },
  { id: "1-3", name: "Yogurt", parent_id: "1", slug: "yogurt", product_count: 25 },
  { id: "1-4", name: "Eggs", parent_id: "1", slug: "eggs", product_count: 20 },
  { id: "2-1", name: "Rice", parent_id: "2", slug: "rice", product_count: 40 },
  { id: "2-2", name: "Pasta", parent_id: "2", slug: "pasta", product_count: 30 },
  { id: "2-3", name: "Bread", parent_id: "2", slug: "bread", product_count: 15 },
  { id: "3-1", name: "Juice", parent_id: "3", slug: "juice", product_count: 60 },
  { id: "3-2", name: "Water", parent_id: "3", slug: "water", product_count: 40 },
  { id: "3-3", name: "Tea", parent_id: "3", slug: "tea", product_count: 50 },
  { id: "3-4", name: "Coffee", parent_id: "3", slug: "coffee", product_count: 50 },
  { id: "4-1", name: "Chips", parent_id: "4", slug: "chips", product_count: 55 },
  { id: "4-2", name: "Chocolate", parent_id: "4", slug: "chocolate", product_count: 60 },
  { id: "4-3", name: "Biscuits", parent_id: "4", slug: "biscuits", product_count: 35 },
  { id: "5-1", name: "Poultry", parent_id: "5", slug: "poultry", product_count: 30 },
  { id: "5-2", name: "Beef", parent_id: "5", slug: "beef", product_count: 20 },
  { id: "5-3", name: "Fish", parent_id: "5", slug: "fish", product_count: 10 },
];

export const categoryService = {
  async getCategories(): Promise<Category[]> {
    // TODO: replace with real API call
    // const res = await http.get('/categories');
    // return res.data;
    return mockCategories;
  },

  async createCategory(payload: unknown): Promise<Category> {
    const parsed = CreateCategorySchema.safeParse(payload);
    if (!parsed.success) throw new Error(parsed.error.issues[0].message);

    // TODO: replace with real API call
    // const res = await http.post('/categories', parsed.data);
    // return res.data;

    return {
      id: Math.random().toString(36).slice(2),
      name: parsed.data.name,
      parent_id: parsed.data.parent_id,
      slug: parsed.data.slug ?? parsed.data.name.toLowerCase().replace(/\s+/g, "-"),
      description: parsed.data.description,
      product_count: 0,
    };
  },

  async updateCategory(id: string, payload: unknown): Promise<Category> {
    const parsed = UpdateCategorySchema.safeParse(payload);
    if (!parsed.success) throw new Error(parsed.error.issues[0].message);

    // TODO: replace with real API call
    // const res = await http.put(`/categories/${id}`, parsed.data);
    // return res.data;

    const existing = mockCategories.find(c => c.id === id);
    return {
      id,
      name: parsed.data.name,
      parent_id: existing?.parent_id ?? null,
      slug: parsed.data.slug ?? parsed.data.name.toLowerCase().replace(/\s+/g, "-"),
      description: parsed.data.description,
      product_count: existing?.product_count ?? 0,
    };
  },

  async deleteCategory(id: string): Promise<void> {
    // TODO: replace with real API call
    // await http.delete(`/categories/${id}`);
    console.log("delete category", id);
  },
};