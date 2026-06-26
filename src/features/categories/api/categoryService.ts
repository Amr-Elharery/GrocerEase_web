import http from "@/shared/http";
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

interface ApiCategory {
  id: number;
  category_name: string;
  subcategories: ApiCategory[];
}

function flatten(apiCats: ApiCategory[]): Category[] {
  const out: Category[] = [];
  for (const cat of apiCats) {
    out.push({
      id: String(cat.id),
      name: cat.category_name,
      parent_id: null,
      product_count: 0,
    });
    for (const sub of cat.subcategories ?? []) {
      out.push({
        id: String(sub.id),
        name: sub.category_name,
        parent_id: String(cat.id),
        product_count: 0,
      });
    }
  }
  return out;
}

export const categoryService = {
  async getCategories(): Promise<Category[]> {
    const res = await http.get("/categories/");
    return flatten(res.data);
  },

  async createCategory(payload: unknown): Promise<Category> {
    const parsed = CreateCategorySchema.safeParse(payload);
    if (!parsed.success) throw new Error(parsed.error.issues[0].message);
    const { name, parent_id } = parsed.data;

    if (parent_id) {
      const res = await http.post(`/categories/${parent_id}/subcategories`, {
        category_name: name,
      });
      return {
        id: String(res.data.id),
        name: res.data.category_name,
        parent_id,
        product_count: 0,
      };
    }

    const res = await http.post("/categories/", { category_name: name });
    return {
      id: String(res.data.id),
      name: res.data.category_name,
      parent_id: null,
      product_count: 0,
    };
  },

  async updateCategory(_id: string, _payload: unknown): Promise<Category> {
    throw new Error("Renaming categories isn't supported by the backend yet.");
  },

  async deleteCategory(id: string): Promise<void> {
    try {
      await http.delete(`/categories/${id}`);
    } catch (err) {
      const detail = (err as { data?: { detail?: string } })?.data?.detail ?? "";
      if (typeof detail === "string" && detail.includes("foreign key")) {
        throw new Error("Delete its sub-categories first, then delete this category.");
      }
      throw new Error("Couldn't delete this category. Please try again.");
    }
  },
};