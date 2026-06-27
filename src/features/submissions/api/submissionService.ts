import { z } from "zod";
import http from "@/shared/http";

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

interface ApiRequest {
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

async function buildCategoryNames(): Promise<Map<number, string>> {
  const map = new Map<number, string>();
  try {
    const res = await http.get("/categories/");
    for (const cat of res.data ?? []) {
      map.set(cat.id, cat.category_name);
      for (const sub of cat.subcategories ?? []) {
        map.set(sub.id, sub.category_name);
      }
    }
  } catch {
//
  }
  return map;
}

function normalizeStatus(status: string): Submission["status"] {
  const s = (status ?? "").toLowerCase();
  if (s === "approved") return "approved";
  if (s === "rejected") return "rejected";
  if (s === "flagged") return "flagged";
  return "pending";
}

function mapRequest(r: ApiRequest, catNames: Map<number, string>): Submission {
  return {
    id: String(r.id),
    submission_id: `REQ-${r.id}`,
    product_name: r.name,
    barcode: "",
    category_name: catNames.get(r.category_id) ?? "",
    category_id: String(r.category_id),
    sub_category_name: r.subcategory_id != null ? (catNames.get(r.subcategory_id) ?? "") : "",
    sub_category_id: r.subcategory_id != null ? String(r.subcategory_id) : "",
    submitted_by: r.requested_by ?? "",
    submitter_role: "VENDOR",
    submitted_at: r.created_at,
    status: normalizeStatus(r.status),
    image_url: r.image_url ?? undefined,
    description: r.description ?? undefined,
    brand: r.brand ?? undefined,
    unit: r.unit ?? undefined,
    assets: [],
    internal_log: [],
  };
}

export const submissionService = {
  async getSubmissions(): Promise<Submission[]> {
    const [res, catNames] = await Promise.all([
      http.get("/product-requests/", { params: { limit: 100, offset: 0 } }),
      buildCategoryNames(),
    ]);
    const items: ApiRequest[] = res.data ?? [];
    return items
      .map((r) => mapRequest(r, catNames))
      .sort((a, b) => new Date(a.submitted_at).getTime() - new Date(b.submitted_at).getTime());
  },

  async approveSubmission(id: string, _data?: unknown): Promise<void> {
    await http.patch(`/product-requests/${id}/approve`);
  },

  async rejectSubmission(id: string, _reason?: string): Promise<void> {
    await http.patch(`/product-requests/${id}/reject`);
  },
};