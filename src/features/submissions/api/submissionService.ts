import { z } from "zod";

export const SubmissionSchema = z.object({
  id: z.string(),
  submission_id: z.string(),
  product_name: z.string(),
  barcode: z.string(),
  category_name: z.string(),
  category_id: z.string(),
  sub_category_name: z.string(),
  sub_category_id: z.string(),
  submitted_by: z.string(),
  submitter_role: z.enum(["STORE_MANAGER", "VENDOR"]),
  submitted_at: z.string(),
  status: z.enum(["pending", "approved", "rejected", "flagged"]),
  image_url: z.string().optional(),
  description: z.string().optional(),
  brand: z.string().optional(),
  unit: z.string().optional(),
  manufacturer: z.string().optional(),
  sku_status: z.string().optional(),
  assets: z.array(z.object({ name: z.string(), type: z.string() })).optional(),
  internal_log: z.array(z.object({
    actor: z.string(),
    action: z.string(),
    timestamp: z.string(),
  })).optional(),
});

export type Submission = z.infer<typeof SubmissionSchema>;

const mockSubmissions: Submission[] = [
  {
    id: "1", submission_id: "SUB-9402",
    product_name: "Mos­tarda Spreads 250g", barcode: "745920381500",
    category_name: "Spreads", category_id: "10",
    sub_category_name: "Honey", sub_category_id: "10-1",
    submitted_by: "Ahmed Hassan", submitter_role: "STORE_MANAGER",
    submitted_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    status: "pending",
    description: "Natural honey spread imported from Upper Egypt, 250g glass jar.",
    brand: "El Nakhla", sku_status: "New Entry",
    assets: [{ name: "spec_sheet.pdf", type: "pdf" }, { name: "product_image.png", type: "image" }],
    internal_log: [
      { actor: "System", action: "flagged for pricing validation", timestamp: new Date(Date.now() - 2 * 3600000).toISOString() },
      { actor: "Admin Console", action: "assigned to Review Queue", timestamp: new Date(Date.now() - 600000).toISOString() },
    ],
  },
  {
    id: "2", submission_id: "SUB-9398",
    product_name: "Feta Cheese 400g", barcode: "745920381501",
    category_name: "Dairy", category_id: "1",
    sub_category_name: "Cheese", sub_category_id: "1-2",
    submitted_by: "Sara Mahmoud", submitter_role: "VENDOR",
    submitted_at: new Date(Date.now() - 3 * 86400000).toISOString(),
    status: "flagged",
    description: "Traditional Egyptian feta cheese in brine, 400g pack.",
    brand: "Misr Dairy", sku_status: "Update",
    assets: [{ name: "product_specs.pdf", type: "pdf" }],
    internal_log: [
      { actor: "System", action: "flagged for duplicate barcode check", timestamp: new Date(Date.now() - 3 * 3600000).toISOString() },
    ],
  },
  {
    id: "3", submission_id: "SUB-9395",
    product_name: "Basmati Rice 5kg", barcode: "745920381502",
    category_name: "Grains", category_id: "2",
    sub_category_name: "Rice", sub_category_id: "2-1",
    submitted_by: "Mohamed Ali", submitter_role: "STORE_MANAGER",
    submitted_at: new Date(Date.now() - 3 * 86400000).toISOString(),
    status: "pending",
    description: "Premium long-grain basmati rice, 5kg bag.",
    brand: "Abu Kass", sku_status: "New Entry",
    assets: [],
    internal_log: [],
  },
  {
    id: "4", submission_id: "SUB-9390",
    product_name: "Hibiscus Tea 20 Bags", barcode: "745920381503",
    category_name: "Beverages", category_id: "3",
    sub_category_name: "Tea", sub_category_id: "3-3",
    submitted_by: "Nour Ibrahim", submitter_role: "VENDOR",
    submitted_at: new Date(Date.now() - 4 * 86400000).toISOString(),
    status: "pending",
    description: "Dried hibiscus flower tea bags, caffeine-free, 20 bags per box.",
    brand: "El Arosa", sku_status: "New Entry",
    assets: [{ name: "packaging.png", type: "image" }],
    internal_log: [],
  },
];
export const submissionService = {
  async getSubmissions(): Promise<Submission[]> {
    // TODO: replace with real API call
    // const res = await http.get('/submissions?status=pending');
    // return res.data;
    return [...mockSubmissions].sort((a, b) =>
      new Date(a.submitted_at).getTime() - new Date(b.submitted_at).getTime()
    );
  },

  async approveSubmission(id: string, data: unknown): Promise<void> {
  // TODO: Step 1 — create real product row
  // const product = await http.post('/products', data);

  // TODO: Step 2 — upload image if kept
  // if (imageKept) {
  //   await http.post(`/products/${product.id}/images`, { file: image, is_primary: true });
  // }

  // TODO: Step 3 — update submission status
  // await http.patch(`/submissions/${id}`, { status: 'approved' });

  // TODO: Step 4 — push notification to customer
  // await http.post(`/notifications`, {
  //   user_id: submission.submitted_by_id,
  //   message: 'Your product suggestion was added to the catalog!'
  // });

  console.log("approve submission", id, data);
  const index = mockSubmissions.findIndex(s => s.id === id);
  if (index !== -1) mockSubmissions[index].status = "approved";
},

  async rejectSubmission(id: string, reason: string): Promise<void> {
    // TODO: replace with real API calls
    // 1. PATCH /submissions/:id { status: 'rejected', reason }
    // await http.patch(`/submissions/${id}`, { status: 'rejected', reason });
    // 2. Push notification to customer with reason
    // 3. Log in audit_log: admin_id, reason, timestamp
    console.log("reject submission", id, reason);
    const index = mockSubmissions.findIndex(s => s.id === id);
    if (index !== -1) mockSubmissions[index].status = "rejected";
  },
};