import { useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { useLogout } from "@/features/auth/hooks/useAuth";
import { useProfile } from "@/features/profile/hooks/useProfile";
import { LayoutDashboard, Package, ShoppingCart, LogOut, ChevronLeft, ChevronRight, Search, Settings, ClipboardList } from "lucide-react";
import { useSearch } from "@/Context/SearchContext";
import NotificationsBell from "@/features/notifications/components/NotificationsBell";
import { LanguageSwitcher } from "@/components/domain/LanguageSwitcher";
import { ZadLogo } from "@/components/domain/ZadLogo";

export default function StoreLayout() {
  const { t } = useTranslation("layout");
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const { search, setSearch } = useSearch();
  const handleLogout = useLogout();
  const { data: user } = useProfile();

  const initial = (user?.full_name || t("defaultStoreName")).charAt(0).toUpperCase();

  // لما تكتبي في السيرش، حط الكلمة وروح لصفحة المخزون لو مش عليها
  const handleSearchChange = (value: string) => {
    setSearch(value);
    if (value && location.pathname !== "/store/inventory") {
      navigate("/store/inventory");
    }
  };

  const navItems = [
    { icon: LayoutDashboard, label: t("store.nav.dashboard"), path: "/store/home" },
    { icon: Package, label: t("store.nav.inventory"), path: "/store/inventory" },
    { icon: ShoppingCart, label: t("store.nav.orders"), path: "/store/orders" },
    { icon: ClipboardList, label: t("store.nav.myRequests"), path: "/store/my-requests" },
    { icon: Settings, label: t("store.nav.shopSettings"), path: "/store/shop-settings" },
  ];

  return (
    <div className="flex min-h-screen bg-background">

      {/* Sidebar */}
      <aside className={`flex flex-col h-screen fixed start-0 top-0 pt-4 pb-8 bg-[#1B4332] z-40 transition-all duration-300 ${collapsed ? "w-16" : "w-60"}`}>

        {/* Logo */}
        <div className={`mb-8 flex flex-col gap-1 ${collapsed ? "items-center px-2" : "px-6"}`}>
          <ZadLogo collapsed={collapsed} to="/store/home" />
          {!collapsed && (
            <p className="text-[10px] text-green-300 rtl:text-right">{t("brand.storeTagline")}</p>
          )}
        </div>

        {/* Nav Items */}
        <nav className="flex-1 px-2 space-y-1">
          {navItems.map(({ icon: Icon, label, path }) => {
            const active = location.pathname.startsWith(path);
            return (
              <Link key={path} to={path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded transition-colors ${
                  collapsed ? "justify-center" : ""
                } ${
                  active
                    ? "bg-[#2D6A4F] text-white"
                    : "text-green-200 hover:bg-[#2D6A4F]/50 hover:text-white"
                }`}
                title={collapsed ? label : undefined}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {!collapsed && <span className="text-xs font-semibold uppercase tracking-wide">{label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="px-2 pt-4 border-t border-[#2D6A4F] space-y-1">
          
          <button onClick={handleLogout}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded text-green-200 hover:bg-[#2D6A4F]/50 hover:text-white transition-colors ${collapsed ? "justify-center" : ""}`}
            title={collapsed ? t("signOut") : undefined}
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {!collapsed && <span className="text-xs font-semibold uppercase tracking-wide">{t("signOut")}</span>}
          </button>
        </div>

        {/* Toggle Button */}
        <button
          onClick={() => setCollapsed(p => !p)}
          aria-label={t("toggleSidebar")}
          className="absolute -end-3 top-4 w-6 h-6 bg-[#1B4332] border border-[#2D6A4F] rounded-full flex items-center justify-center shadow-sm hover:bg-[#2D6A4F] transition-colors"
        >
          {collapsed ? <ChevronRight className="w-3 h-3 text-white rtl:-scale-x-100" /> : <ChevronLeft className="w-3 h-3 text-white rtl:-scale-x-100" />}
        </button>
      </aside>

      {/* Main */}
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${collapsed ? "ms-16" : "ms-60"}`}>

        {/* Top Navbar */}
        <header className="flex justify-between items-center h-14 px-6 sticky top-0 z-30 bg-white border-b border-border">
          <div className="flex items-center flex-1 max-w-xl">
            <div className="relative w-full">
              <input
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full bg-muted/50 border-none rounded py-2 ps-10 pe-4 text-sm focus:ring-1 focus:ring-primary outline-none"
                placeholder={t("search.placeholder")}
                type="text"
              />
              <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <NotificationsBell />
            <div className="h-6 w-px bg-border" />
            <Link to="/store/profile"
              className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-sm font-bold text-primary-foreground">
              {initial}
            </Link>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-x-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}