import { useEffect, useRef, useState } from "react";
import type React from "react";
import {
  useUsers,
  useSuspendUser,
  useReactivateUser,
} from "../hooks/useUsers";
import { type User } from "../api/userService";
import { Check, ChevronDown, Search, Ban, CircleCheck, Users, X } from "lucide-react";

const roleColors: Record<string, string> = {
  admin: "bg-[#EAF7EE] text-[#006B22]",
  store_manager: "bg-[#FFF3DF] text-[#B45309]",
  delivery: "bg-[#EAF1FF] text-[#2563EB]",
  customer: "bg-[#F3E8FF] text-[#7E22CE]",
  none: "bg-[#F3F4F6] text-[#667085]",
};

function getInitials(name: string) {
  return name.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase();
}

function formatRole(role: string) {
  if (role === "store_manager") return "Store Manager";
  if (role === "none" || role === "-") return "No Role";
  return role.charAt(0).toUpperCase() + role.slice(1);
}

function FilterDropdown({
  value,
  options,
  onChange,
}: {
  value: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = options.find((o) => o.value === value) ?? options[0];

  useEffect(() => {
    function onOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onOutside);
    return () => document.removeEventListener("mousedown", onOutside);
  }, []);

  return (
    <div ref={ref} className="relative w-[165px]">
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="flex h-9 w-full items-center justify-between rounded-lg border border-[#DDE7DF] bg-[#F8FAF8] px-3 text-sm font-medium text-[#101828] transition hover:bg-white"
      >
        <span className="truncate">{selected.label}</span>
        <ChevronDown className={`h-4 w-4 shrink-0 text-[#5F7168] transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute left-0 top-11 z-30 w-full overflow-hidden rounded-lg border border-[#DDE7DF] bg-white shadow-[0_12px_28px_rgba(15,23,42,0.14)]">
          {options.map((o) => (
            <button
              key={o.value}
              type="button"
              onClick={() => { onChange(o.value); setOpen(false); }}
              className={`flex w-full items-center justify-between px-3 py-2 text-left text-sm transition ${
                value === o.value ? "bg-[#EAF7EE] font-semibold text-[#006B22]" : "text-[#101828] hover:bg-[#F8FAF8]"
              }`}
            >
              <span>{o.label}</span>
              {value === o.value && <Check className="h-3.5 w-3.5 text-[#006B22]" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function UserManagement() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [page, setPage] = useState(1);

  const { data, isLoading } = useUsers(roleFilter, statusFilter, page);
  const users = data?.users ?? [];
  const total = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 1;
  const suspendUser = useSuspendUser();
  const reactivateUser = useReactivateUser();

  const setRole = (v: string) => { setRoleFilter(v); setPage(1); };
  const setStatus = (v: string) => { setStatusFilter(v); setPage(1); };

  const roleOptions = [
    { value: "", label: "All Roles" },
    { value: "admin", label: "Admin" },
    { value: "store_manager", label: "Store Manager" },
    { value: "customer", label: "Customer" },
    { value: "delivery", label: "Delivery" },
  ];
  const statusOptions = [
    { value: "", label: "All Statuses" },
    { value: "active", label: "Active" },
    { value: "suspended", label: "Suspended" },
  ];

  const filtered = users.filter((user) => {
    const s = search.trim().toLowerCase();
    if (s && !user.name.toLowerCase().includes(s) && !user.email.toLowerCase().includes(s)) return false;
    return true;
  });

  const displayRole = (user: User): string =>
    user.role === "-" && roleFilter ? roleFilter : user.role;

  const toggleStatus = (user: User) => {
    if (user.status === "active") suspendUser.mutate(user.id);
    else reactivateUser.mutate(user.id);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[calc(100vh-64px)] items-center justify-center">
        <p className="text-sm text-[#667085]">Loading users...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1420px] space-y-4">
      {/* Header */}
      <div>
        <h1 className="text-[24px] font-bold tracking-tight text-[#101828]">User Directory</h1>
        <p className="mt-1 text-sm text-[#667085]">View and manage all registered platform users.</p>
      </div>

      <div className="overflow-hidden rounded-xl border border-[#DDE7DF] bg-white shadow-[0_2px_10px_rgba(15,23,42,0.04)]">
        {/* Filter bar */}
        <div className="border-b border-[#DDE7DF] px-4 py-3">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#EAF7EE] text-[#006B22]">
                <Users className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-bold text-[#101828]">Filter Users</p>
                <p className="text-xs text-[#667085]">Refine users by role, status, or search.</p>
              </div>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <FilterDropdown value={roleFilter} options={roleOptions} onChange={setRole} />
              <FilterDropdown value={statusFilter} options={statusOptions} onChange={setStatus} />
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#667085]" />
                <input
                  value={search}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
                  placeholder="Search users..."
                  className="h-9 w-full rounded-lg border border-[#DDE7DF] bg-[#F8FAF8] pl-9 pr-3 text-sm text-[#101828] outline-none placeholder:text-[#98A2B3] focus:border-[#2D6A4F] sm:w-[220px]"
                />
              </div>
              <button
                type="button"
                onClick={() => { setRoleFilter(""); setStatusFilter(""); setSearch(""); setPage(1); }}
                className="h-9 rounded-lg border border-[#DDE7DF] bg-white px-3 text-sm font-semibold text-[#5F7168] transition hover:bg-[#F8FAF8]"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <table className="min-w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-[#DDE7DF] bg-[#F8FAF8] text-[11px] font-semibold uppercase tracking-wider text-[#5F7168]">
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#DDE7DF]">
            {filtered.map((user) => {
              const busy = suspendUser.isPending || reactivateUser.isPending;
              return (
                <tr key={user.id} onClick={() => setSelectedUser(user)} className="cursor-pointer transition hover:bg-[#F8FAF8]">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#2D6A4F] text-xs font-bold text-white">
                        {getInitials(user.name)}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-[#101828]">{user.name}</p>
                        <p className="truncate text-xs text-[#667085]">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded-md px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider ${roleColors[displayRole(user)] ?? "bg-[#F3F4F6] text-[#667085]"}`}>
                      {formatRole(displayRole(user))}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <span className={`h-1.5 w-1.5 rounded-full ${user.status === "active" ? "bg-green-500" : "bg-red-500"}`} />
                      <span className="text-sm capitalize text-[#101828]">{user.status}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                    {user.status === "active" ? (
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => toggleStatus(user)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-[#FECACA] bg-[#FEF2F2] px-3 py-1.5 text-xs font-semibold text-[#DC2626] transition hover:bg-[#FEE2E2] disabled:opacity-50"
                      >
                        <Ban className="h-3.5 w-3.5" />
                        Suspend
                      </button>
                    ) : (
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => toggleStatus(user)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-[#BBF7D0] bg-[#F0FDF4] px-3 py-1.5 text-xs font-semibold text-[#16A34A] transition hover:bg-[#DCFCE7] disabled:opacity-50"
                      >
                        <CircleCheck className="h-3.5 w-3.5" />
                        Activate
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-10 text-center text-sm text-[#667085]">
                  No users match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-[#DDE7DF] px-4 py-3">
          <p className="text-sm text-[#667085]">
            Showing <span className="font-semibold text-[#101828]">{filtered.length}</span> of{" "}
            <span className="font-semibold text-[#101828]">{total}</span> users
            <span className="ml-2 text-[#98A2B3]">• Page {page} of {totalPages}</span>
          </p>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="flex h-8 items-center justify-center rounded-lg border border-[#DDE7DF] px-3 text-xs font-semibold text-[#5F7168] transition hover:bg-[#F8FAF8] disabled:opacity-40"
            >
              Previous
            </button>
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="flex h-8 items-center justify-center rounded-lg border border-[#DDE7DF] px-3 text-xs font-semibold text-[#5F7168] transition hover:bg-[#F8FAF8] disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* User detail modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6" onClick={() => setSelectedUser(null)}>
          <div className="w-full max-w-md overflow-hidden rounded-xl bg-white shadow-xl" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#DDE7DF] px-5 py-4">
              <h2 className="text-base font-semibold text-[#101828]">User Details</h2>
              <button
                onClick={() => setSelectedUser(null)}
                className="flex h-7 w-7 items-center justify-center rounded-lg text-[#667085] transition hover:bg-[#F1F3F5]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Body */}
            <div className="space-y-4 p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#2D6A4F] text-lg font-bold text-white">
                  {getInitials(selectedUser.name)}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-lg font-bold text-[#101828]">{selectedUser.name}</p>
                  <p className="truncate text-sm text-[#667085]">{selectedUser.email}</p>
                </div>
              </div>

              <div className="space-y-3 rounded-lg bg-[#F8FAF8] p-4">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#667085]">Phone</span>
                  <span className="text-sm font-medium text-[#101828]">{selectedUser.phone || "—"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#667085]">Role</span>
                  <span className={`rounded-md px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider ${roleColors[displayRole(selectedUser)] ?? "bg-[#F3F4F6] text-[#667085]"}`}>
                    {formatRole(displayRole(selectedUser))}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#667085]">Status</span>
                  <span className="flex items-center gap-1.5">
                    <span className={`h-1.5 w-1.5 rounded-full ${selectedUser.status === "active" ? "bg-green-500" : "bg-red-500"}`} />
                    <span className="text-sm capitalize text-[#101828]">{selectedUser.status}</span>
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#667085]">User ID</span>
                  <span className="max-w-[180px] truncate font-mono text-xs text-[#5F7168]">{selectedUser.id}</span>
                </div>
              </div>
            </div>

            {/* Footer action */}
            <div className="border-t border-[#DDE7DF] px-5 py-4">
              {selectedUser.status === "active" ? (
                <button
                  type="button"
                  disabled={suspendUser.isPending}
                  onClick={() => { suspendUser.mutate(selectedUser.id); setSelectedUser(null); }}
                  className="flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-[#FECACA] bg-[#FEF2F2] text-sm font-semibold text-[#DC2626] transition hover:bg-[#FEE2E2] disabled:opacity-50"
                >
                  <Ban className="h-4 w-4" />
                  Suspend User
                </button>
              ) : (
                <button
                  type="button"
                  disabled={reactivateUser.isPending}
                  onClick={() => { reactivateUser.mutate(selectedUser.id); setSelectedUser(null); }}
                  className="flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-[#BBF7D0] bg-[#F0FDF4] text-sm font-semibold text-[#16A34A] transition hover:bg-[#DCFCE7] disabled:opacity-50"
                >
                  <CircleCheck className="h-4 w-4" />
                  Activate User
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}