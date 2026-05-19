import { Link, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Leaf } from "lucide-react";
import { authService } from "@/features/auth/api/authService";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout();
    navigate("/auth/login");
  };

  return (
    <header className="h-16 bg-white border-b border-border flex items-center justify-between px-6 relative z-50">

      <Link to="/app/home" className="flex items-center gap-2 no-underline">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
          <Leaf className="w-4 h-4 text-primary-foreground" />
        </div>
        <span className="font-bold text-primary text-lg tracking-tight">ZAD</span>
      </Link>

      <nav className="flex items-center gap-6">
        <Link to="/app/home"      className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Home</Link>
        <Link to="/app/inventory" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Inventory</Link>
        <Link to="/app/orders"    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Orders</Link>
        <Link to="/app/reports"   className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Reports</Link>
      </nav>

      <div className="flex items-center gap-2">
        <Button asChild variant="ghost" size="sm" className="rounded-full">
          <Link to="/app/profile">Profile</Link>
        </Button>
        <Button onClick={handleLogout} size="sm" className="rounded-full">
          Logout
        </Button>
      </div>

    </header>
  );
}