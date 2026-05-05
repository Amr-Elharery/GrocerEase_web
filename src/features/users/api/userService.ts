import { z } from "zod";

export const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  phone: z.string().optional(),
  role: z.enum(["admin", "store_manager", "delivery"]),
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

const mockUsers: User[] = [
  { id: "1", name: "Ahmed Hassan", email: "ahmed@zad.com", phone: "01012345678", role: "store_manager", status: "active", last_login: new Date(Date.now() - 2 * 3600000).toISOString(), shop_ids: ["shop-1"] },
  { id: "2", name: "Sara Mahmoud", email: "sara@zad.com", phone: "01098765432", role: "store_manager", status: "active", last_login: new Date(Date.now() - 5 * 3600000).toISOString(), shop_ids: ["shop-2"] },
  { id: "3", name: "Mohamed Ali", email: "mohamed@zad.com", phone: "01123456789", role: "delivery", status: "active", last_login: new Date(Date.now() - 1 * 86400000).toISOString() },
  { id: "4", name: "Nour Ibrahim", email: "nour@zad.com", phone: "01234567890", role: "delivery", status: "suspended", last_login: new Date(Date.now() - 5 * 86400000).toISOString() },
  { id: "5", name: "Kareem Samir", email: "kareem@zad.com", phone: "01187654321", role: "store_manager", status: "active", last_login: new Date(Date.now() - 3 * 3600000).toISOString(), shop_ids: ["shop-3"] },
  { id: "6", name: "Layla Omar", email: "layla@zad.com", phone: "01056789012", role: "delivery", status: "active", last_login: new Date(Date.now() - 2 * 86400000).toISOString() },
  { id: "7", name: "Omar Khaled", email: "omar@zad.com", phone: "01145678901", role: "admin", status: "active", last_login: new Date(Date.now() - 1 * 3600000).toISOString() },
  { id: "8", name: "Dina Fathy", email: "dina@zad.com", phone: "01067890123", role: "store_manager", status: "suspended", last_login: new Date(Date.now() - 10 * 86400000).toISOString(), shop_ids: ["shop-4"] },
];

export const userService = {
  async getUsers(): Promise<User[]> {
    // TODO: replace with real API call
    // const res = await http.get('/users');
    // return res.data;
    return mockUsers;
  },

  async createUser(payload: unknown): Promise<User> {
    const parsed = CreateUserSchema.safeParse(payload);
    if (!parsed.success) throw new Error(parsed.error.issues[0].message);

    // TODO: replace with real API call
    // const res = await http.post('/users', parsed.data);
    // System generates and emails a temporary password
    // return res.data;

    const newUser: User = {
      id: Math.random().toString(36).slice(2),
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone,
      role: parsed.data.role,
      status: "active",
      shop_ids: parsed.data.shop_ids,
    };
    mockUsers.push(newUser);
    return newUser;
  },

  async suspendUser(id: string): Promise<User> {
    // TODO: replace with real API call
    // const res = await http.patch(`/users/${id}`, { status: 'suspended' });
    // Blacklists all active JWTs for that user
    // Writes to audit_log
    // return res.data;

    const index = mockUsers.findIndex(u => u.id === id);
    if (index !== -1) mockUsers[index].status = "suspended";
    return mockUsers[index];
  },

  async reactivateUser(id: string): Promise<User> {
    // TODO: replace with real API call
    // const res = await http.patch(`/users/${id}`, { status: 'active' });
    // Writes to audit_log
    // return res.data;

    const index = mockUsers.findIndex(u => u.id === id);
    if (index !== -1) mockUsers[index].status = "active";
    return mockUsers[index];
  },

  async changeRole(id: string, role: User["role"], shop_ids?: string[]): Promise<User> {
    // TODO: replace with real API call
    // const res = await http.patch(`/users/${id}`, { role, shop_ids });
    // Re-assigns shop access if changing to/from manager
    // Writes to audit_log
    // return res.data;

    const index = mockUsers.findIndex(u => u.id === id);
    if (index !== -1) {
      mockUsers[index].role = role;
      mockUsers[index].shop_ids = shop_ids;
    }
    return mockUsers[index];
  },
};