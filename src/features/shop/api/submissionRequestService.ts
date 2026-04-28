import { z } from "zod";

export const ProductRequestSchema = z.object({
  product_name: z.string().min(2, "Product name must be at least 2 characters"),
  brand: z.string().optional(),
  description: z.string().optional(),
  category_id: z.string().min(1, "Category is required"),
  sub_category_id: z.string().min(1, "Sub-category is required"),
  barcode: z.string().optional(),
  unit: z.string().optional(),
  submitted_by_shop_id: z.string(),
});

export type ProductRequestInput = z.infer<typeof ProductRequestSchema>;

export const submissionRequestService = {
  async submitRequest(payload: unknown): Promise<void> {
    const parsed = ProductRequestSchema.safeParse(payload);
    if (!parsed.success) throw new Error(parsed.error.issues[0].message);

    // TODO: replace with real API call
    // const res = await http.post('/products/submissions', {
    //   ...parsed.data,
    //   status: 'pending',
    // });
    // return res.data; // 202 Accepted

    console.log("submit product request", parsed.data);
  },
};