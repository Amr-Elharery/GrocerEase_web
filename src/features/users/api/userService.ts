import { z } from "zod";
import http from "@/shared/http";

export const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  phone: z.string().optional(),
  role: z.string(),
  status: z.enum(["active", "suspended"]),
  last_login: z.string().optional(),
  shop_ids: z.array(z.string()).optional(),
});

export const CreateUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email"),
  phone: z.string().optional(),
  role: z.enum(["admin", "store_manager", "delivery"]),
  shop_ids: z.array(z.string()).optional(),
});

export type User = z.infer<typeof UserSchema>;
export type CreateUserInput = z.infer<typeof CreateUserSchema>;

interface ApiUser {
  id: string;
  email: string;
  phone: string | null;
  full_name: string | null;
  roles: string[];
  is_active: boolean;
}

function mapRole(roles: string[]): string {
  const set = (roles ?? []).map((r) => r.toLowerCase());

  if (set.length === 0) return "-";

  if (set.some((r) => r.includes("store") || r.includes("vendor") || r.includes("manager")))
    return "store_manager";

  if (set.some((r) => r.includes("delivery") || r.includes("driver")))
    return "delivery";

  if (set.some((r) => r.includes("customer")))
    return "customer";

  return "-";
}

function mapUser(u: ApiUser): User {
  return {
    id: u.id,
    name: u.full_name ?? u.email,
    email: u.email,
    phone: u.phone ?? undefined,
    role: mapRole(u.roles),
    status: u.is_active ? "active" : "suspended",
  };
}

// ترجمة دور الواجهة → اسم الدور اللي الباك بيفهمه
const roleToApi: Record<string, string> = {
  store_manager: "vendor",
  customer: "customer",
  delivery: "delivery",
};

export const userService = {
  async getUsers(opts: { role?: string; status?: string } = {}): Promise<User[]> {
    const params: Record<string, string> = {};
    if (opts.role && roleToApi[opts.role]) {
      params.role = roleToApi[opts.role];
    }
    if (opts.status) {
      params.status = opts.status; // active / suspended
    }
    const res = await http.get("/auth/users", { params });
    const items: ApiUser[] = res.data ?? [];
    return items.map(mapUser);
  },

  async suspendUser(id: string): Promise<void> {
    await http.post(`/auth/suspend/${id}`);
  },

  async reactivateUser(id: string): Promise<void> {
    await http.post(`/auth/activate/${id}`);
  },

  async changeRole(_id: string, _role: User["role"], _shop_ids?: string[]): Promise<void> {
    throw new Error("Changing roles isn't available yet (no backend endpoint).");
  },
};