import { useState } from "react";
import { useUsers, useCreateUser, useSuspendUser, useReactivateUser, useChangeRole } from "../hooks/useUsers";
import { type User } from "../api/userService";
import { Plus, X, Check, ArrowLeft, Shield, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const roleColors: Record<string, string> = {
  admin: "bg-purple-100 text-purple-700",
  store_manager: "bg-orange-100 text-orange-700",
  delivery: "bg-blue-100 text-blue-700",
};

const mockShops = [
  { id: "shop-1", name: "Cairo Store" },
  { id: "shop-2", name: "Alexandria Store" },
  { id: "shop-3", name: "Giza Store" },
  { id: "shop-4", name: "Mansoura Store" },
  { id: "shop-5", name: "Aswan Store" },
];

const mockAuditLog = [
  { action: "Role Updated", detail: "To: Store Manager by Admin", time: "2 hours ago" },
  { action: "Email Verified", detail: "Automated system check", time: "Oct 20, 2023 • 09:12 AM" },
  { action: "User Created", detail: "Initial onboarding", time: "Oct 18, 2023 • 15:45 PM" },
];

type FormErrors = { name?: string; email?: string; role?: string; };
type View = "list" | "detail" | "create";

function getInitials(name: string) {
  return name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
}

export default function UserManagement() {
  const { data: users = [], isLoading } = useUsers();
  const createUser = useCreateUser();
  const suspendUser = useSuspendUser();
  const reactivateUser = useReactivateUser();
  const changeRole = useChangeRole();

  const [view, setView] = useState<View>("list");
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newRole, setNewRole] = useState<User["role"]>("delivery");
  const [newShopIds, setNewShopIds] = useState<string[]>([]);
  const [createSuccess, setCreateSuccess] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", role: "" as User["role"] | "", shop_ids: [] as string[] });
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const filtered = users.filter(u => {
    if (roleFilter && u.role !== roleFilter) return false;
    if (statusFilter && u.status !== statusFilter) return false;
    if (search && !u.name.toLowerCase().includes(search.toLowerCase()) &&
        !u.email.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const activeCount = users.filter(u => u.status === "active").length;

  const handleCreateSubmit = () => {
    const errors: FormErrors = {};
    if (!formData.name || formData.name.length < 2) errors.name = "Name must be at least 2 characters";
    if (!formData.email || !formData.email.includes("@")) errors.email = "Invalid email";
    if (!formData.role) errors.role = "Role is required";
    if (Object.keys(errors).length > 0) { setFormErrors(errors); return; }

    createUser.mutate({
      name: formData.name, email: formData.email, phone: formData.phone,
      role: formData.role,
      shop_ids: formData.role === "store_manager" ? formData.shop_ids : undefined,
    }, { onSuccess: () => setCreateSuccess(true) });
  };

  const handleRoleSave = () => {
    if (!selectedUser) return;
    changeRole.mutate({
      id: selectedUser.id, role: newRole,
      shop_ids: newRole === "store_manager" ? newShopIds : undefined,
    }, {
      onSuccess: () => setView("list"),
    });
  };

  if (isLoading) return (
    <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
      <p className="text-muted-foreground">Loading...</p>
    </div>
  );

  // ── Detail View ──────────────────────────────────────────────
  if (view === "detail" && selectedUser) return (
    <div className="space-y-4 max-w-4xl">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => setView("list")}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-border hover:bg-muted/50 transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-xl font-bold">User Details</h1>
            <p className="text-xs text-muted-foreground">Edit system permissions and profile metadata</p>
          </div>
        </div>
        <Button size="sm" onClick={handleRoleSave} disabled={changeRole.isPending}>
          {changeRole.isPending ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      {/* Security Notice */}
      <div className="flex items-start gap-3 p-4 rounded-lg bg-blue-50 border border-blue-200">
        <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <p className="text-xs font-semibold text-blue-800">System Security Notice</p>
          <p className="text-xs text-blue-700 mt-0.5">Passwords for administrative accounts are strictly system-generated and managed via the identity provider. Users cannot manually change passwords through this interface.</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">

        {/* Left — Profile + Role */}
        <div className="col-span-2 space-y-4">

          {/* Profile Information */}
          <div className="bg-white border border-border rounded-lg p-5 space-y-4">
            <h2 className="text-sm font-semibold flex items-center gap-2">
              <Shield className="w-4 h-4 text-muted-foreground" />
              Profile Information
            </h2>
            <div className="space-y-1.5">
              <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Full Name</Label>
              <Input
                defaultValue={selectedUser.name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSelectedUser(prev => prev ? { ...prev, name: e.target.value } : prev)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Email Address</Label>
                <Input
                  defaultValue={selectedUser.email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setSelectedUser(prev => prev ? { ...prev, email: e.target.value } : prev)}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Phone Number</Label>
                <Input
                  defaultValue={selectedUser.phone ?? ""}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setSelectedUser(prev => prev ? { ...prev, phone: e.target.value } : prev)}
                />
              </div>
            </div>
          </div>

          {/* Role & Permissions */}
          <div className="bg-white border border-border rounded-lg p-5 space-y-4">
            <h2 className="text-sm font-semibold flex items-center gap-2">
              <Shield className="w-4 h-4 text-muted-foreground" />
              Role & Permissions
            </h2>
            <div className="space-y-1.5">
              <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">System Role</Label>
              <select value={newRole}
                onChange={e => { setNewRole(e.target.value as User["role"]); setNewShopIds([]); }}
                className="h-9 w-full rounded-lg border border-input bg-transparent px-3 text-sm outline-none focus:border-ring">
                <option value="admin">Admin</option>
                <option value="store_manager">Store Manager</option>
                <option value="delivery">Delivery</option>
              </select>
            </div>

            {newRole === "store_manager" && (
              <div className="space-y-2">
                <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Shop Assignment (Multi-Select)</Label>
                <div className="space-y-2 border border-border rounded-lg overflow-hidden">
                  {newShopIds.map(shopId => {
                    const shop = mockShops.find(s => s.id === shopId);
                    return (
                      <div key={shopId} className="flex items-center justify-between px-3 py-2 border-b border-border last:border-0">
                        <span className="text-sm">{shop?.name ?? shopId}</span>
                        <button onClick={() => setNewShopIds(prev => prev.filter(id => id !== shopId))}
                          className="w-5 h-5 flex items-center justify-center rounded text-muted-foreground hover:text-destructive">
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    );
                  })}
                  <div className="px-3 py-2">
                    <select onChange={e => { if (e.target.value && !newShopIds.includes(e.target.value)) setNewShopIds(prev => [...prev, e.target.value]); e.target.value = ""; }}
                      className="w-full text-xs text-primary bg-transparent outline-none cursor-pointer">
                      <option value="">+ Add Shop Assignment</option>
                      {mockShops.filter(s => !newShopIds.includes(s.id)).map(s => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right — Account Status + Audit Log */}
        <div className="space-y-4">

          {/* Account Status */}
          <div className="bg-white border border-border rounded-lg p-4 space-y-3">
            <h2 className="text-sm font-semibold">Account Status</h2>
            <div className="flex rounded-lg border border-border overflow-hidden">
              <button
                onClick={() => {
                  if (selectedUser.status === "suspended") {
                    reactivateUser.mutate(selectedUser.id, {
                      onSuccess: () => setSelectedUser(prev => prev ? { ...prev, status: "active" } : prev)
                    });
                  }
                }}
                className={`flex-1 py-2 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                  selectedUser.status === "active"
                    ? "bg-green-50 text-green-700 border-r border-green-200"
                    : "bg-white text-muted-foreground hover:bg-muted/50 border-r border-border"
                }`}>
                <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                Active
              </button>
              <button
                onClick={() => {
                  if (selectedUser.status === "active") {
                    suspendUser.mutate(selectedUser.id, {
                      onSuccess: () => setSelectedUser(prev => prev ? { ...prev, status: "suspended" } : prev)
                    });
                  }
                }}
                className={`flex-1 py-2 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                  selectedUser.status === "suspended"
                    ? "bg-red-50 text-red-700"
                    : "bg-white text-muted-foreground hover:bg-muted/50"
                }`}>
                <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                Suspended
              </button>
            </div>
            {selectedUser.last_login && (
              <p className="text-[10px] text-muted-foreground">
                Last access: {new Date(selectedUser.last_login).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })}
              </p>
            )}
          </div>

          {/* Audit Log */}
          <div className="bg-white border border-border rounded-lg p-4 space-y-3">
            <h2 className="text-sm font-semibold">Audit Log</h2>
            <div className="space-y-3">
              {mockAuditLog.map((log, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                    i === 0 ? "border-primary bg-primary" : "border-border bg-white"
                  }`}>
                    {i === 0 && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                  <div>
                    <p className="text-xs font-semibold">{log.action}</p>
                    <p className="text-[10px] text-muted-foreground">{log.detail}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{log.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="text-xs text-primary font-medium hover:underline w-full text-center">
              View Full History
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // ── Create View ──────────────────────────────────────────────
  if (view === "create") return (
    <div className="max-w-lg space-y-4">
      <div className="flex items-center gap-3">
        <button onClick={() => setView("list")}
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-border hover:bg-muted/50 transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h1 className="text-xl font-bold">Create User</h1>
      </div>

      {createSuccess ? (
        <div className="bg-white border border-border rounded-lg p-8 flex flex-col items-center text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
            <Check className="w-6 h-6 text-green-600" />
          </div>
          <p className="text-sm font-semibold">User Created!</p>
          <p className="text-xs text-muted-foreground">A temporary password has been generated and emailed to {formData.email}.</p>
          <Button size="sm" onClick={() => setView("list")} className="w-full mt-2">Done</Button>
        </div>
      ) : (
        <div className="bg-white border border-border rounded-lg p-5 space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs">Full Name *</Label>
            <Input value={formData.name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(p => ({ ...p, name: e.target.value }))}
              placeholder="e.g. Ahmed Hassan"
              className={formErrors.name ? "border-destructive" : ""} />
            {formErrors.name && <p className="text-xs text-destructive">{formErrors.name}</p>}
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Email *</Label>
            <Input type="email" value={formData.email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(p => ({ ...p, email: e.target.value }))}
              placeholder="e.g. ahmed@zad.com"
              className={formErrors.email ? "border-destructive" : ""} />
            {formErrors.email && <p className="text-xs text-destructive">{formErrors.email}</p>}
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Phone</Label>
            <Input value={formData.phone}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(p => ({ ...p, phone: e.target.value }))}
              placeholder="e.g. 01012345678" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Role *</Label>
            <select value={formData.role}
              onChange={e => setFormData(p => ({ ...p, role: e.target.value as User["role"], shop_ids: [] }))}
              className={`h-9 w-full rounded-lg border bg-transparent px-3 text-sm outline-none focus:border-ring ${formErrors.role ? "border-destructive" : "border-input"}`}>
              <option value="">Select role</option>
              <option value="admin">Admin</option>
              <option value="store_manager">Store Manager</option>
              <option value="delivery">Delivery</option>
            </select>
            {formErrors.role && <p className="text-xs text-destructive">{formErrors.role}</p>}
          </div>
          {formData.role === "store_manager" && (
            <div className="space-y-2">
              <Label className="text-xs">Assign Shops</Label>
              {mockShops.map(shop => (
                <label key={shop.id} className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox"
                    checked={formData.shop_ids.includes(shop.id)}
                    onChange={e => setFormData(p => ({
                      ...p,
                      shop_ids: e.target.checked ? [...p.shop_ids, shop.id] : p.shop_ids.filter(id => id !== shop.id)
                    }))}
                    className="accent-primary" />
                  {shop.name}
                </label>
              ))}
            </div>
          )}
          <p className="text-xs text-muted-foreground bg-muted/30 px-3 py-2 rounded-lg">
            A temporary password will be generated and emailed to the user automatically.
          </p>
          <div className="flex gap-2 pt-2">
            <Button variant="outline" size="sm" className="flex-1" onClick={() => setView("list")}>Cancel</Button>
            <Button size="sm" className="flex-1" onClick={handleCreateSubmit} disabled={createUser.isPending}>
              {createUser.isPending ? "Creating..." : "Create User"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );

  // ── List View ──────────────────────────────────────────────
  return (
    <div className="space-y-4">

      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold">User Directory</h1>
          <p className="text-sm text-muted-foreground mt-0.5">A comprehensive overview of all registered platform users.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Total Active Users</p>
            <p className="text-2xl font-bold text-primary">{activeCount.toLocaleString()}</p>
          </div>
          <Button size="sm" className="gap-1.5 text-xs" onClick={() => { setView("create"); setCreateSuccess(false); setFormData({ name: "", email: "", phone: "", role: "", shop_ids: [] }); setFormErrors({}); }}>
            <Plus className="w-3.5 h-3.5" /> Add User
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3 items-center">
        <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)}
          className="h-8 rounded-lg border border-input bg-white px-3 text-sm outline-none focus:border-ring">
          <option value="">All Roles</option>
          <option value="admin">Admin</option>
          <option value="store_manager">Store Manager</option>
          <option value="delivery">Delivery</option>
        </select>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          className="h-8 rounded-lg border border-input bg-white px-3 text-sm outline-none focus:border-ring">
          <option value="">Status: All</option>
          <option value="active">Active</option>
          <option value="suspended">Suspended</option>
        </select>
        {(roleFilter || statusFilter || search) && (
          <button onClick={() => { setRoleFilter(""); setStatusFilter(""); setSearch(""); }}
            className="text-xs text-primary hover:underline">
            Clear all filters
          </button>
        )}
        <span className="ml-auto text-xs text-muted-foreground">Displaying {filtered.length} of {users.length}</span>
      </div>

      {/* Table */}
      <div className="bg-white border border-border rounded-lg overflow-hidden">
        <table className="min-w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border bg-muted/20">
              <th className="px-4 py-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">User</th>
              <th className="px-4 py-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Role</th>
              <th className="px-4 py-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Last Login</th>
              <th className="px-4 py-3 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.map(user => (
              <tr key={user.id} className="hover:bg-muted/20 transition-colors cursor-pointer"
                onClick={() => { setSelectedUser(user); setView("detail"); setNewRole(user.role); setNewShopIds(user.shop_ids ?? []); }}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 ${
                      user.role === "admin" ? "bg-purple-500" :
                      user.role === "store_manager" ? "bg-orange-500" : "bg-blue-500"
                    }`}>
                      {getInitials(user.name)}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded uppercase tracking-wider ${roleColors[user.role]}`}>
                    {user.role === "store_manager" ? "Manager" : user.role}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${user.status === "active" ? "bg-green-500" : "bg-red-500"}`} />
                    <span className="text-sm capitalize">{user.status}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground whitespace-nowrap">
                  {user.last_login ? new Date(user.last_login).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "Never"}
                </td>
                <td className="px-4 py-3">
                  <button className="text-muted-foreground hover:text-foreground transition-colors"
                    onClick={e => e.stopPropagation()}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="px-4 py-3 border-t border-border text-sm text-muted-foreground">
          {filtered.length} users
        </div>
      </div>
    </div>
  );
}