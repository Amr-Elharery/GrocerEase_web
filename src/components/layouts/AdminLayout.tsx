import { useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router";
import { useTranslation } from "react-i18next";

import {
  Search,
  LayoutDashboard,
  Package,
  Warehouse,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Tag,
  ClipboardList,
  Users,
  Store,
} from "lucide-react";

import { useLogout } from "@/features/auth/hooks/useAuth";
import { useProfile } from "@/features/profile/hooks/useProfile";
import { useSearch } from "@/Context/SearchContext";
import NotificationsBell from "@/features/notifications/components/NotificationsBell";
import { LanguageSwitcher } from "@/components/domain/LanguageSwitcher";
import { ZadLogo } from "@/components/domain/ZadLogo";

type NavItem = {
  icon: React.ElementType;
  label: string;
  path: string;
};

export default function AdminLayout() {
  const { t } = useTranslation("layout");
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const { search, setSearch } = useSearch();
  const handleLogout = useLogout();
  const { data: user } = useProfile();

  const displayName = user?.full_name || t("defaultAdminName");
  const initial = (user?.full_name || t("defaultAdminName")).charAt(0).toUpperCase();

  const handleSearchChange = (value: string) => {
    setSearch(value);
    if (value && location.pathname !== "/app/inventory") {
      navigate("/app/inventory");
    }
  };

  const navItems: NavItem[] = [
    { icon: LayoutDashboard, label: t("admin.nav.dashboard"), path: "/app/home" },
    { icon: Package, label: t("admin.nav.products"), path: "/app/inventory" },
    { icon: Tag, label: t("admin.nav.categories"), path: "/app/categories" },
    { icon: ClipboardList, label: t("admin.nav.requests"), path: "/app/submissions" },
    { icon: Users, label: t("admin.nav.users"), path: "/app/users" },
    { icon: Store, label: t("admin.nav.shops"), path: "/app/shops" },
    { icon: Warehouse, label: t("admin.nav.orders"), path: "/app/orders" },
  ];

  return (
    <div className="min-h-screen bg-[#F3F8F5]">
      {/* Sidebar */}
      <aside
        className={`fixed start-0 top-0 z-40 flex h-screen flex-col bg-gradient-to-b from-[#1B4332] via-[#2D6A4F] to-[#1B4332] py-4 shadow-xl transition-all duration-300 ${
          collapsed ? "w-20" : "w-60"
        }`}
      >
        {/* Logo */}
        <div className="mb-5 px-6">
          <ZadLogo collapsed={collapsed} to="/app/home" />
        </div>

        {/* Main Navigation */}
        <nav className="space-y-1 px-3">
          {navItems.map(({ icon: Icon, label, path }) => {
            const active = location.pathname.startsWith(path);

            return (
              <Link
                key={path}
                to={path}
                title={collapsed ? label : undefined}
                className={`group flex items-center gap-3 rounded-xl px-4 py-1.5 text-sm font-medium transition-all ${
                  collapsed ? "justify-center" : ""
                } ${
                  active
                    ? "bg-[#52B788]/25 text-white shadow-sm"
                    : "text-[#D8F3DC] hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {!collapsed && <span>{label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Navigation */}
        <div className="mt-auto space-y-2 border-t border-white/10 px-3 pt-4">
          <button
            type="button"
            onClick={handleLogout}
            title={collapsed ? t("signOut") : undefined}
            className={`flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-[#D8F3DC] transition-all hover:bg-white/10 hover:text-white ${
              collapsed ? "justify-center" : ""
            }`}
          >
            <LogOut className="h-5 w-5 shrink-0" />
            {!collapsed && <span>{t("signOut")}</span>}
          </button>
        </div>

        {/* Collapse Button */}
        <button
          type="button"
          onClick={() => setCollapsed((prev) => !prev)}
          className="absolute -end-4 top-7 flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-[#1B4332] text-white shadow-lg transition hover:bg-[#2D6A4F]"
          aria-label={t("toggleSidebar")}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4 rtl:-scale-x-100" />
          ) : (
            <ChevronLeft className="h-4 w-4 rtl:-scale-x-100" />
          )}
        </button>
      </aside>

      {/* Page Wrapper */}
      <div
        className={`min-h-screen transition-all duration-300 ${
          collapsed ? "ms-20" : "ms-60"
        }`}
      >
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 flex h-14 w-full items-center border-b border-[#E2E8E3] bg-white/90 px-6 shadow-[0_1px_0_rgba(16,24,40,0.02)] backdrop-blur-md">
          {/* Search */}
          <div className="relative w-full max-w-[720px]">
            <Search className="absolute start-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#5F7268]" />

            <input
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="h-11 w-full rounded-xl border border-[#DFE7E1] bg-[#F3F6F2] ps-11 pe-4 text-sm text-[#1a1f2e] outline-none transition placeholder:text-[#718278] focus:border-[#52B788] focus:bg-white focus:ring-2 focus:ring-[#52B788]/25"
              placeholder={t("search.placeholder")}
              type="text"
            />
          </div>

          {/* Right Side */}
          <div className="ms-auto flex shrink-0 items-center justify-end gap-4">
            <LanguageSwitcher />

            <NotificationsBell />

            <div className="h-8 w-px bg-[#DFE7E1]" />

            <Link
              to="/app/profile"
              className="flex h-9 items-center gap-2 rounded-full ps-2 pe-3 transition hover:bg-[#F3F6F2]"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#2D6A4F] text-sm font-bold text-white">
                {initial}
              </div>

              <span className="whitespace-nowrap text-sm font-bold text-[#1a1f2e]">
                {displayName}
              </span>
            </Link>
          </div>
        </header>

        {/* Main Content */}
        <main className="relative min-h-[calc(100vh-64px)] overflow-hidden bg-[#F7FBF8] p-5">
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -left-32 top-16 h-[420px] w-[420px] rounded-full bg-[#EEF8F2] opacity-80 blur-3xl" />
            <div className="absolute right-[-180px] top-8 h-[520px] w-[520px] rounded-full bg-[#F1FAF5] opacity-80 blur-3xl" />
            <div className="absolute bottom-[-220px] left-[12%] h-[380px] w-[780px] rounded-[50%] bg-[#E0EEE6] opacity-45 blur-3xl" />
            <div className="absolute bottom-[-260px] right-[-120px] h-[360px] w-[720px] rounded-[50%] bg-[#D6E5DC] opacity-30 blur-3xl" />
          </div>

          <div className="relative z-10">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}