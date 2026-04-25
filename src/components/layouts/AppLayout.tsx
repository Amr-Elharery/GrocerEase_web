import { useState } from "react";
import { Outlet, Link, useLocation } from "react-router";
import { useLogout } from "@/features/auth/hooks/useAuth";
import { Leaf, Search, LayoutDashboard, Package, Warehouse, Settings, HelpCircle, LogOut, ChevronLeft, ChevronRight, Tag, ClipboardList } from "lucide-react";
import { useSearch } from "@/Context/SearchContext";

export default function AppLayout() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const { search, setSearch } = useSearch();

const handleLogout = useLogout();

  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/app/home" },
    { icon: Package, label: "Products", path: "/app/inventory" },
    { icon: Tag, label: "Categories", path: "/app/categories" },
    { icon: ClipboardList, label: "Submissions", path: "/app/submissions" },
    { icon: Warehouse, label: "Orders", path: "/app/orders" },
    { icon: Settings, label: "Reports", path: "/app/reports" },
  ];

  return (
    <div className="flex min-h-screen bg-white">

      {/* Sidebar */}
      <aside className={`flex flex-col h-screen fixed left-0 top-0 pt-4 pb-8 bg-white border-r border-border z-40 transition-all duration-300 ${collapsed ? "w-16" : "w-60"}`}>

        {/* Logo */}
        <div className={`mb-8 flex items-center ${collapsed ? "justify-center px-2" : "px-6 gap-3"}`}>
          <Link to="/app/home" className="flex items-center gap-2 no-underline">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shrink-0">
              <Leaf className="w-4 h-4 text-primary-foreground" />
            </div>
            {!collapsed && (
              <span className="font-bold text-primary text-lg tracking-tight">ZAD</span>
            )}
          </Link>
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
                    ? "bg-muted text-foreground border-r-2 border-foreground"
                    : "text-muted-foreground hover:bg-muted/50"
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
        <div className="px-2 pt-4 border-t border-border space-y-1">
          <Link to="/app/profile"
            className={`flex items-center gap-3 px-3 py-2.5 rounded text-muted-foreground hover:bg-muted/50 transition-colors ${collapsed ? "justify-center" : ""}`}
            title={collapsed ? "Support" : undefined}
          >
            <HelpCircle className="w-4 h-4 shrink-0" />
            {!collapsed && <span className="text-xs font-semibold uppercase tracking-wide">Support</span>}
          </Link>
          <button onClick={handleLogout}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded text-muted-foreground hover:bg-muted/50 transition-colors ${collapsed ? "justify-center" : ""}`}
            title={collapsed ? "Sign Out" : undefined}
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {!collapsed && <span className="text-xs font-semibold uppercase tracking-wide">Sign Out</span>}
          </button>
        </div>

        {/* Toggle Button */}
        <button
          onClick={() => setCollapsed(p => !p)}
          className="absolute -right-3 top-4 w-6 h-6 bg-white border border-border rounded-full flex items-center justify-center shadow-sm hover:bg-muted/50 transition-colors"
        >
          {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
        </button>
      </aside>

      {/* Main */}
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${collapsed ? "ml-16" : "ml-60"}`}>

        {/* Top Navbar */}
        <header className="flex justify-between items-center h-14 px-6 sticky top-0 z-30 bg-white border-b border-border">
          <div className="flex items-center flex-1 max-w-xl">
            <div className="relative w-full">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-muted/50 border-none rounded py-2 pl-10 pr-4 text-sm focus:ring-1 focus:ring-foreground outline-none"
                placeholder="Search products, barcodes, or brands..."
                type="text"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-6 w-px bg-border" />
            <Link to="/app/profile"
              className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-bold text-foreground">
              Raghd
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