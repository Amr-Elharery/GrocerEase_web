import { useEffect, useRef, useState } from "react";
import type React from "react";
import {
  useUsers,
  useCreateUser,
  useSuspendUser,
  useReactivateUser,
  useChangeRole,
} from "../hooks/useUsers";
import { type User } from "../api/userService";
import {
  Plus,
  X,
  Check,
  ArrowLeft,
  Shield,
  Info,
  ChevronDown,
  MoreVertical,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const roleColors: Record<string, string> = {
  admin: "bg-[#EAF7EE] text-[#006B22]",
  store_manager: "bg-[#FFF3DF] text-[#B45309]",
  delivery: "bg-[#EAF1FF] text-[#2563EB]",
};

const mockShops = [
  { id: "shop-1", name: "Cairo Store" },
  { id: "shop-2", name: "Alexandria Store" },
  { id: "shop-3", name: "Giza Store" },
  { id: "shop-4", name: "Mansoura Store" },
  { id: "shop-5", name: "Aswan Store" },
];

const mockAuditLog = [
  {
    action: "Role Updated",
    detail: "To: Store Manager by Admin",
    time: "2 hours ago",
  },
  {
    action: "Email Verified",
    detail: "Automated system check",
    time: "Oct 20, 2023 • 09:12 AM",
  },
  {
    action: "User Created",
    detail: "Initial onboarding",
    time: "Oct 18, 2023 • 15:45 PM",
  },
];

type FormErrors = {
  name?: string;
  email?: string;
  role?: string;
};

type View = "list" | "detail" | "create";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function formatRole(role: User["role"]) {
  if (role === "store_manager") return "Manager";
  return role.charAt(0).toUpperCase() + role.slice(1);
}

function formatDate(date?: string | null) {
  if (!date) return "Never";

  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
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

  const [roleFilterOpen, setRoleFilterOpen] = useState(false);
  const [statusFilterOpen, setStatusFilterOpen] = useState(false);
  const [createRoleOpen, setCreateRoleOpen] = useState(false);
  const [detailRoleOpen, setDetailRoleOpen] = useState(false);
  const [shopDropdownOpen, setShopDropdownOpen] = useState(false);

  const roleFilterRef = useRef<HTMLDivElement | null>(null);
  const statusFilterRef = useRef<HTMLDivElement | null>(null);
  const createRoleRef = useRef<HTMLDivElement | null>(null);
  const detailRoleRef = useRef<HTMLDivElement | null>(null);
  const shopDropdownRef = useRef<HTMLDivElement | null>(null);

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newRole, setNewRole] = useState<User["role"]>("delivery");
  const [newShopIds, setNewShopIds] = useState<string[]>([]);

  const [createSuccess, setCreateSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "" as User["role"] | "",
    shop_ids: [] as string[],
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const roleOptions = [
    { value: "", label: "All Roles" },
    { value: "admin", label: "Admin" },
    { value: "store_manager", label: "Store Manager" },
    { value: "delivery", label: "Delivery" },
  ];

  const roleInputOptions: { value: User["role"]; label: string }[] = [
    { value: "admin", label: "Admin" },
    { value: "store_manager", label: "Store Manager" },
    { value: "delivery", label: "Delivery" },
  ];

  const statusOptions = [
    { value: "", label: "All Statuses" },
    { value: "active", label: "Active" },
    { value: "suspended", label: "Suspended" },
  ];

  const selectedRoleLabel =
    roleOptions.find((option) => option.value === roleFilter)?.label ??
    "All Roles";

  const selectedStatusLabel =
    statusOptions.find((option) => option.value === statusFilter)?.label ??
    "All Statuses";

  const selectedCreateRoleLabel =
    roleInputOptions.find((option) => option.value === formData.role)?.label ??
    "Select role";

  const selectedDetailRoleLabel =
    roleInputOptions.find((option) => option.value === newRole)?.label ??
    "Select role";

  const availableShops = mockShops.filter(
    (shop) => !newShopIds.includes(shop.id)
  );

  const filtered = users.filter((user) => {
    if (roleFilter && user.role !== roleFilter) return false;
    if (statusFilter && user.status !== statusFilter) return false;

    const searchValue = search.trim().toLowerCase();

    if (
      searchValue &&
      !user.name.toLowerCase().includes(searchValue) &&
      !user.email.toLowerCase().includes(searchValue)
    ) {
      return false;
    }

    return true;
  });

  const activeCount = users.filter((user) => user.status === "active").length;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;

      if (roleFilterRef.current && !roleFilterRef.current.contains(target)) {
        setRoleFilterOpen(false);
      }

      if (
        statusFilterRef.current &&
        !statusFilterRef.current.contains(target)
      ) {
        setStatusFilterOpen(false);
      }

      if (createRoleRef.current && !createRoleRef.current.contains(target)) {
        setCreateRoleOpen(false);
      }

      if (detailRoleRef.current && !detailRoleRef.current.contains(target)) {
        setDetailRoleOpen(false);
      }

      if (
        shopDropdownRef.current &&
        !shopDropdownRef.current.contains(target)
      ) {
        setShopDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleCreateSubmit = () => {
    const errors: FormErrors = {};

    if (!formData.name || formData.name.length < 2) {
      errors.name = "Name must be at least 2 characters";
    }

    if (!formData.email || !formData.email.includes("@")) {
      errors.email = "Invalid email";
    }

    if (!formData.role) {
      errors.role = "Role is required";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    createUser.mutate(
      {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        role: formData.role,
        shop_ids:
          formData.role === "store_manager" ? formData.shop_ids : undefined,
      },
      {
        onSuccess: () => setCreateSuccess(true),
      }
    );
  };

  const handleRoleSave = () => {
    if (!selectedUser) return;

    changeRole.mutate(
      {
        id: selectedUser.id,
        role: newRole,
        shop_ids: newRole === "store_manager" ? newShopIds : undefined,
      },
      {
        onSuccess: () => setView("list"),
      }
    );
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[calc(100vh-64px)] items-center justify-center">
        <p className="text-sm text-[#667085]">Loading users...</p>
      </div>
    );
  }

  if (view === "detail" && selectedUser) {
    return (
      <div className="mx-auto max-w-[1120px] space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setView("list")}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#DDE7DF] bg-white text-[#5F7168] transition hover:bg-[#F8FAF8] hover:text-[#101828]"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>

            <div>
              <h1 className="text-[23px] font-bold tracking-tight text-[#101828]">
                User Details
              </h1>
              <p className="mt-0.5 text-sm text-[#667085]">
                Edit system permissions and profile metadata.
              </p>
            </div>
          </div>

          <Button
            size="sm"
            onClick={handleRoleSave}
            disabled={changeRole.isPending}
            className="h-9 rounded-lg bg-[#006B22] px-4 text-sm font-semibold text-white hover:bg-[#00571C]"
          >
            {changeRole.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>

        <div className="flex items-start gap-3 rounded-xl border border-[#CFE3D7] bg-[#F2FAF5] p-4">
  <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#006B22]" />
  <div>
    <p className="text-xs font-semibold text-[#006B22]">
      System Security Notice
    </p>
    <p className="mt-0.5 text-xs leading-5 text-[#5F7168]">
              Passwords for administrative accounts are system-generated and
              managed through the identity provider. Users cannot manually
              change passwords through this interface.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            <div className="space-y-4 rounded-xl border border-[#DDE7DF] bg-white p-5 shadow-[0_2px_10px_rgba(15,23,42,0.04)]">
              <h2 className="flex items-center gap-2 text-sm font-bold text-[#101828]">
                <Shield className="h-4 w-4 text-[#5F7168]" />
                Profile Information
              </h2>

              <div className="space-y-1.5">
                <Label className="text-[11px] font-semibold uppercase tracking-wider text-[#667085]">
                  Full Name
                </Label>
                <Input
                  defaultValue={selectedUser.name}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                    setSelectedUser((prev) =>
                      prev ? { ...prev, name: event.target.value } : prev
                    )
                  }
                  className="h-10 rounded-lg border-[#DDE7DF] bg-[#F8FAF8]"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-1.5">
                  <Label className="text-[11px] font-semibold uppercase tracking-wider text-[#667085]">
                    Email Address
                  </Label>
                  <Input
                    defaultValue={selectedUser.email}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                      setSelectedUser((prev) =>
                        prev ? { ...prev, email: event.target.value } : prev
                      )
                    }
                    className="h-10 rounded-lg border-[#DDE7DF] bg-[#F8FAF8]"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-[11px] font-semibold uppercase tracking-wider text-[#667085]">
                    Phone Number
                  </Label>
                  <Input
                    defaultValue={selectedUser.phone ?? ""}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                      setSelectedUser((prev) =>
                        prev ? { ...prev, phone: event.target.value } : prev
                      )
                    }
                    className="h-10 rounded-lg border-[#DDE7DF] bg-[#F8FAF8]"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4 rounded-xl border border-[#DDE7DF] bg-white p-5 shadow-[0_2px_10px_rgba(15,23,42,0.04)]">
              <h2 className="flex items-center gap-2 text-sm font-bold text-[#101828]">
                <Shield className="h-4 w-4 text-[#5F7168]" />
                Role & Permissions
              </h2>

              <div className="space-y-1.5">
                <Label className="text-[11px] font-semibold uppercase tracking-wider text-[#667085]">
                  System Role
                </Label>

                <div className="relative" ref={detailRoleRef}>
                  <button
                    type="button"
                    onClick={() => setDetailRoleOpen((prev) => !prev)}
                    className="flex h-10 w-full items-center justify-between rounded-lg border border-[#DDE7DF] bg-[#F8FAF8] px-3 text-left text-sm text-[#101828] outline-none transition hover:bg-white focus:border-[#2D6A4F]"
                  >
                    <span>{selectedDetailRoleLabel}</span>
                    <ChevronDown
                      className={`h-4 w-4 text-[#5F7168] transition-transform ${
                        detailRoleOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {detailRoleOpen && (
                    <div className="absolute left-0 top-11 z-50 w-full overflow-hidden rounded-lg border border-[#DDE7DF] bg-white shadow-[0_12px_28px_rgba(15,23,42,0.14)]">
                      {roleInputOptions.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => {
                            setNewRole(option.value);
                            setNewShopIds([]);
                            setShopDropdownOpen(false);
                            setDetailRoleOpen(false);
                          }}
                          className={`flex w-full items-center justify-between px-3 py-2 text-left text-sm transition ${
                            newRole === option.value
                              ? "bg-[#EAF7EE] font-semibold text-[#006B22]"
                              : "text-[#101828] hover:bg-[#F8FAF8]"
                          }`}
                        >
                          <span>{option.label}</span>
                          {newRole === option.value && (
                            <Check className="h-3.5 w-3.5 text-[#006B22]" />
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {newRole === "store_manager" && (
                <div className="space-y-2">
                  <Label className="text-[11px] font-semibold uppercase tracking-wider text-[#667085]">
                    Shop Assignment
                  </Label>

                  <div className="overflow-visible rounded-lg border border-[#DDE7DF] bg-white">
                    {newShopIds.map((shopId) => {
                      const shop = mockShops.find((item) => item.id === shopId);

                      return (
                        <div
                          key={shopId}
                          className="flex items-center justify-between border-b border-[#DDE7DF] px-3 py-2 last:border-0"
                        >
                          <span className="text-sm text-[#101828]">
                            {shop?.name ?? shopId}
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              setNewShopIds((prev) =>
                                prev.filter((id) => id !== shopId)
                              )
                            }
                            className="flex h-6 w-6 items-center justify-center rounded text-[#667085] transition hover:bg-red-50 hover:text-red-600"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      );
                    })}

                    <div className="relative px-3 py-2" ref={shopDropdownRef}>
                      <button
                        type="button"
                        onClick={() =>
                          setShopDropdownOpen((prev) => !prev)
                        }
                        className="flex h-8 w-full items-center justify-between rounded-lg bg-[#F8FAF8] px-3 text-left text-xs font-semibold text-[#006B22] outline-none transition hover:bg-[#EAF7EE]"
                      >
                        <span>+ Add Shop Assignment</span>

                        <ChevronDown
                          className={`h-4 w-4 text-[#006B22] transition-transform ${
                            shopDropdownOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      {shopDropdownOpen && (
                        <div className="absolute left-3 right-3 top-11 z-50 overflow-hidden rounded-lg border border-[#DDE7DF] bg-white shadow-[0_12px_28px_rgba(15,23,42,0.14)]">
                          {availableShops.map((shop) => (
                            <button
                              key={shop.id}
                              type="button"
                              onClick={() => {
                                setNewShopIds((prev) => [...prev, shop.id]);
                                setShopDropdownOpen(false);
                              }}
                              className="flex w-full items-center justify-between px-3 py-2 text-left text-sm text-[#101828] transition hover:bg-[#F8FAF8]"
                            >
                              <span>{shop.name}</span>
                            </button>
                          ))}

                          {availableShops.length === 0 && (
                            <div className="px-3 py-2 text-sm text-[#667085]">
                              All shops assigned
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-3 rounded-xl border border-[#DDE7DF] bg-white p-4 shadow-[0_2px_10px_rgba(15,23,42,0.04)]">
              <h2 className="text-sm font-bold text-[#101828]">
                Account Status
              </h2>

              <div className="flex overflow-hidden rounded-lg border border-[#DDE7DF]">
                <button
                  type="button"
                  onClick={() => {
                    if (selectedUser.status === "suspended") {
                      reactivateUser.mutate(selectedUser.id, {
                        onSuccess: () =>
                          setSelectedUser((prev) =>
                            prev ? { ...prev, status: "active" } : prev
                          ),
                      });
                    }
                  }}
                  className={`flex flex-1 items-center justify-center gap-1.5 border-r py-2 text-xs font-semibold transition ${
                    selectedUser.status === "active"
                      ? "border-green-200 bg-green-50 text-green-700"
                      : "border-[#DDE7DF] bg-white text-[#667085] hover:bg-[#F8FAF8]"
                  }`}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                  Active
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (selectedUser.status === "active") {
                      suspendUser.mutate(selectedUser.id, {
                        onSuccess: () =>
                          setSelectedUser((prev) =>
                            prev ? { ...prev, status: "suspended" } : prev
                          ),
                      });
                    }
                  }}
                  className={`flex flex-1 items-center justify-center gap-1.5 py-2 text-xs font-semibold transition ${
                    selectedUser.status === "suspended"
                      ? "bg-red-50 text-red-700"
                      : "bg-white text-[#667085] hover:bg-[#F8FAF8]"
                  }`}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                  Suspended
                </button>
              </div>

              <p className="text-[10px] text-[#667085]">
                Last access: {formatDate(selectedUser.last_login)}
              </p>
            </div>

            <div className="space-y-3 rounded-xl border border-[#DDE7DF] bg-white p-4 shadow-[0_2px_10px_rgba(15,23,42,0.04)]">
              <h2 className="text-sm font-bold text-[#101828]">Audit Log</h2>

              <div className="space-y-3">
                {mockAuditLog.map((log, index) => (
                  <div key={index} className="flex items-start gap-2.5">
                    <div
                      className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 ${
                        index === 0
                          ? "border-[#006B22] bg-[#006B22]"
                          : "border-[#DDE7DF] bg-white"
                      }`}
                    >
                      {index === 0 && (
                        <div className="h-1.5 w-1.5 rounded-full bg-white" />
                      )}
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-[#101828]">
                        {log.action}
                      </p>
                      <p className="text-[10px] text-[#667085]">
                        {log.detail}
                      </p>
                      <p className="mt-0.5 text-[10px] text-[#667085]">
                        {log.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                className="w-full text-center text-xs font-semibold text-[#006B22] hover:underline"
              >
                View Full History
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (view === "create") {
    return (
      <div className="mx-auto max-w-[680px] space-y-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setView("list")}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#DDE7DF] bg-white text-[#5F7168] transition hover:bg-[#F8FAF8] hover:text-[#101828]"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>

          <div>
            <h1 className="text-[24px] font-bold text-[#101828]">
              Create User
            </h1>
            <p className="mt-1 text-sm text-[#667085]">
              Add a new user and assign access permissions.
            </p>
          </div>
        </div>

        {createSuccess ? (
          <div className="flex flex-col items-center space-y-3 rounded-xl border border-[#DDE7DF] bg-white p-8 text-center shadow-[0_2px_10px_rgba(15,23,42,0.04)]">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <Check className="h-6 w-6 text-green-600" />
            </div>

            <p className="text-sm font-semibold text-[#101828]">
              User Created
            </p>

            <p className="text-xs text-[#667085]">
              A temporary password has been generated and emailed to{" "}
              {formData.email}.
            </p>

            <Button
              size="sm"
              onClick={() => setView("list")}
              className="mt-2 w-full rounded-lg bg-[#006B22] text-white hover:bg-[#00571C]"
            >
              Done
            </Button>
          </div>
        ) : (
          <div className="space-y-4 rounded-xl border border-[#DDE7DF] bg-white p-5 shadow-[0_2px_10px_rgba(15,23,42,0.04)]">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-[#101828]">
                Full Name *
              </Label>
              <Input
                value={formData.name}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData((prev) => ({
                    ...prev,
                    name: event.target.value,
                  }))
                }
                placeholder="e.g. Ahmed Hassan"
                className={`h-10 rounded-lg bg-[#F8FAF8] ${
                  formErrors.name ? "border-red-500" : "border-[#DDE7DF]"
                }`}
              />
              {formErrors.name && (
                <p className="text-xs text-red-600">{formErrors.name}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-[#101828]">
                Email *
              </Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData((prev) => ({
                    ...prev,
                    email: event.target.value,
                  }))
                }
                placeholder="e.g. ahmed@zad.com"
                className={`h-10 rounded-lg bg-[#F8FAF8] ${
                  formErrors.email ? "border-red-500" : "border-[#DDE7DF]"
                }`}
              />
              {formErrors.email && (
                <p className="text-xs text-red-600">{formErrors.email}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-[#101828]">
                Phone
              </Label>
              <Input
                value={formData.phone}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData((prev) => ({
                    ...prev,
                    phone: event.target.value,
                  }))
                }
                placeholder="e.g. 01012345678"
                className="h-10 rounded-lg border-[#DDE7DF] bg-[#F8FAF8]"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-[#101828]">
                Role *
              </Label>

              <div className="relative" ref={createRoleRef}>
                <button
                  type="button"
                  onClick={() => setCreateRoleOpen((prev) => !prev)}
                  className={`flex h-10 w-full items-center justify-between rounded-lg bg-[#F8FAF8] px-3 text-left text-sm outline-none transition hover:bg-white focus:border-[#2D6A4F] ${
                    formErrors.role
                      ? "border border-red-500"
                      : "border border-[#DDE7DF]"
                  }`}
                >
                  <span
                    className={
                      formData.role ? "text-[#101828]" : "text-[#5F7168]"
                    }
                  >
                    {selectedCreateRoleLabel}
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 text-[#5F7168] transition-transform ${
                      createRoleOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {createRoleOpen && (
                  <div className="absolute left-0 top-11 z-50 w-full overflow-hidden rounded-lg border border-[#DDE7DF] bg-white shadow-[0_12px_28px_rgba(15,23,42,0.14)]">
                    {roleInputOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => {
                          setFormData((prev) => ({
                            ...prev,
                            role: option.value,
                            shop_ids: [],
                          }));
                          setFormErrors((prev) => ({
                            ...prev,
                            role: undefined,
                          }));
                          setCreateRoleOpen(false);
                        }}
                        className={`flex w-full items-center justify-between px-3 py-2 text-left text-sm transition ${
                          formData.role === option.value
                            ? "bg-[#EAF7EE] font-semibold text-[#006B22]"
                            : "text-[#101828] hover:bg-[#F8FAF8]"
                        }`}
                      >
                        <span>{option.label}</span>
                        {formData.role === option.value && (
                          <Check className="h-3.5 w-3.5 text-[#006B22]" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {formErrors.role && (
                <p className="text-xs text-red-600">{formErrors.role}</p>
              )}
            </div>

            {formData.role === "store_manager" && (
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-[#101828]">
                  Assign Shops
                </Label>

                {mockShops.map((shop) => (
                  <label
                    key={shop.id}
                    className="flex cursor-pointer items-center gap-2 text-sm text-[#101828]"
                  >
                    <input
                      type="checkbox"
                      checked={formData.shop_ids.includes(shop.id)}
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                        setFormData((prev) => ({
                          ...prev,
                          shop_ids: event.target.checked
                            ? [...prev.shop_ids, shop.id]
                            : prev.shop_ids.filter((id) => id !== shop.id),
                        }))
                      }
                      className="accent-[#006B22]"
                    />
                    {shop.name}
                  </label>
                ))}
              </div>
            )}

            <p className="rounded-lg bg-[#F8FAF8] px-3 py-2 text-xs text-[#667085]">
              A temporary password will be generated and emailed to the user
              automatically.
            </p>

            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                className="h-9 flex-1 rounded-lg border-[#DDE7DF]"
                onClick={() => setView("list")}
              >
                Cancel
              </Button>

              <Button
                size="sm"
                className="h-9 flex-1 rounded-lg bg-[#006B22] text-white hover:bg-[#00571C]"
                onClick={handleCreateSubmit}
                disabled={createUser.isPending}
              >
                {createUser.isPending ? "Creating..." : "Create User"}
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1420px] space-y-4">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <h1 className="text-[24px] font-bold tracking-tight text-[#101828]">
            User Directory
          </h1>

          <p className="mt-1 text-sm text-[#667085]">
            A comprehensive overview of all registered platform users.
          </p>
        </div>

        <Button
          size="sm"
          className="h-10 gap-1.5 rounded-lg bg-[#006B22] px-5 text-sm font-semibold text-white shadow-sm hover:bg-[#00571C]"
          onClick={() => {
            setView("create");
            setCreateSuccess(false);
            setFormData({
              name: "",
              email: "",
              phone: "",
              role: "",
              shop_ids: [],
            });
            setFormErrors({});
          }}
        >
          <Plus className="h-4 w-4" />
          Add User
        </Button>
      </div>

      <div className="overflow-hidden rounded-xl border border-[#DDE7DF] bg-white shadow-[0_2px_10px_rgba(15,23,42,0.04)]">
        <div className="border-b border-[#DDE7DF] bg-white px-4 py-3">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex min-w-[210px] items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#EAF7EE] text-[#006B22]">
                <Search className="h-4 w-4" />
              </div>

              <div>
                <p className="text-sm font-bold text-[#101828]">
                  Filter Users
                </p>
                <p className="text-xs text-[#667085]">
                  Refine users by role, status, or search.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <div className="relative" ref={roleFilterRef}>
                <button
                  type="button"
                  onClick={() => setRoleFilterOpen((prev) => !prev)}
                  className="flex h-9 w-[165px] items-center justify-between rounded-lg border border-[#DDE7DF] bg-[#F8FAF8] px-3 text-sm font-medium text-[#101828] outline-none transition hover:bg-white focus:border-[#2D6A4F]"
                >
                  <span className="truncate">{selectedRoleLabel}</span>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 text-[#5F7168] transition-transform ${
                      roleFilterOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {roleFilterOpen && (
                  <div className="absolute left-0 top-11 z-50 w-[165px] overflow-hidden rounded-lg border border-[#DDE7DF] bg-white shadow-[0_12px_28px_rgba(15,23,42,0.14)]">
                    {roleOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => {
                          setRoleFilter(option.value);
                          setRoleFilterOpen(false);
                        }}
                        className={`flex w-full items-center justify-between px-3 py-2 text-left text-sm transition ${
                          roleFilter === option.value
                            ? "bg-[#EAF7EE] font-semibold text-[#006B22]"
                            : "text-[#101828] hover:bg-[#F8FAF8]"
                        }`}
                      >
                        <span>{option.label}</span>
                        {roleFilter === option.value && (
                          <Check className="h-3.5 w-3.5 text-[#006B22]" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="relative" ref={statusFilterRef}>
                <button
                  type="button"
                  onClick={() => setStatusFilterOpen((prev) => !prev)}
                  className="flex h-9 w-[165px] items-center justify-between rounded-lg border border-[#DDE7DF] bg-[#F8FAF8] px-3 text-sm font-medium text-[#101828] outline-none transition hover:bg-white focus:border-[#2D6A4F]"
                >
                  <span className="truncate">{selectedStatusLabel}</span>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 text-[#5F7168] transition-transform ${
                      statusFilterOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {statusFilterOpen && (
                  <div className="absolute left-0 top-11 z-50 w-[165px] overflow-hidden rounded-lg border border-[#DDE7DF] bg-white shadow-[0_12px_28px_rgba(15,23,42,0.14)]">
                    {statusOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => {
                          setStatusFilter(option.value);
                          setStatusFilterOpen(false);
                        }}
                        className={`flex w-full items-center justify-between px-3 py-2 text-left text-sm transition ${
                          statusFilter === option.value
                            ? "bg-[#EAF7EE] font-semibold text-[#006B22]"
                            : "text-[#101828] hover:bg-[#F8FAF8]"
                        }`}
                      >
                        <span>{option.label}</span>
                        {statusFilter === option.value && (
                          <Check className="h-3.5 w-3.5 text-[#006B22]" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#667085]" />
                <input
                  value={search}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                    setSearch(event.target.value)
                  }
                  placeholder="Search users..."
                  className="h-9 w-full rounded-lg border border-[#DDE7DF] bg-[#F8FAF8] pl-9 pr-3 text-sm text-[#101828] outline-none placeholder:text-[#98A2B3] focus:border-[#2D6A4F] sm:w-[230px]"
                />
              </div>

              <button
                type="button"
                onClick={() => {
                  setRoleFilter("");
                  setStatusFilter("");
                  setSearch("");
                  setRoleFilterOpen(false);
                  setStatusFilterOpen(false);
                }}
                className="h-9 rounded-lg border border-[#DDE7DF] bg-white px-3 text-sm font-semibold text-[#5F7168] transition hover:bg-[#F8FAF8] hover:text-[#101828]"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        <table className="min-w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-[#DDE7DF] bg-[#F8FAF8]">
              <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-[#5F7168]">
                User
              </th>
              <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-[#5F7168]">
                Role
              </th>
              <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-[#5F7168]">
                Status
              </th>
              <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-[#5F7168]">
                Last Login
              </th>
              <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-[#5F7168]">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[#DDE7DF]">
            {filtered.map((user) => (
              <tr
                key={user.id}
                className="cursor-pointer transition hover:bg-[#F8FAF8]"
                onClick={() => {
                  setSelectedUser(user);
                  setView("detail");
                  setNewRole(user.role);
                  setNewShopIds(user.shop_ids ?? []);
                }}
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#2D6A4F] text-xs font-bold text-white">
                      {getInitials(user.name)}
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-[#101828]">
                        {user.name}
                      </p>
                      <p className="text-xs text-[#667085]">{user.email}</p>
                    </div>
                  </div>
                </td>

                <td className="px-4 py-3">
                  <span
                    className={`rounded-md px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider ${roleColors[user.role]}`}
                  >
                    {formatRole(user.role)}
                  </span>
                </td>

                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        user.status === "active"
                          ? "bg-green-500"
                          : "bg-red-500"
                      }`}
                    />
                    <span className="text-sm capitalize text-[#101828]">
                      {user.status}
                    </span>
                  </div>
                </td>

                <td className="whitespace-nowrap px-4 py-3 text-sm text-[#667085]">
                  {formatDate(user.last_login)}
                </td>

                <td className="px-4 py-3">
                  <button
                    type="button"
                    className="text-[#5F7168] transition hover:text-[#101828]"
                    onClick={(event) => event.stopPropagation()}
                  >
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-10 text-center text-sm text-[#667085]"
                >
                  No users match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="border-t border-[#DDE7DF] px-4 py-3 text-sm text-[#667085]">
          Showing {filtered.length} of {users.length} users • {activeCount}{" "}
          active users
        </div>
      </div>
    </div>
  );
}