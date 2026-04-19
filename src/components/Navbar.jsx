import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Leaf } from "lucide-react";
export default function Navbar({ variant = "auth", onLogout }) {
  return (
    <header className="h-16 bg-white border-b border-border flex items-center justify-between px-6 relative z-50">
      
      {/* Brand */}
      <Link to="/" className="flex items-center gap-2 no-underline">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
          <Leaf className="w-4 h-4 text-primary-foreground" />
        </div>
        <span className="font-bold text-primary text-lg tracking-tight">ZAD</span>
      </Link>

      {/* Nav Links */}

      {variant === "auth" && (
        <nav className="flex items-center gap-6">
          <Link to="/home"      className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Home</Link>
        
        </nav>
      )}
      {variant === "app" && (
        <nav className="flex items-center gap-6">
          <Link to="/home"      className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <Link to="/inventory" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Inventory</Link>
          <Link to="/orders"    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Orders</Link>
          <Link to="/reports"   className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Reports</Link>
        </nav>
      )}

      {/* Right Side */}
  
      <div className="flex items-center gap-2">
        {variant === "auth" && (
          <Button asChild size="sm" className="rounded-full">
            <Link to="/signup">Sign Up</Link>
          </Button>
        )}
        {variant === "app" && (
          <>
            <Button asChild variant="ghost" size="sm" className="rounded-full">
              <Link to="/profile">Profile</Link>
            </Button>
            <Button onClick={onLogout} size="sm" className="rounded-full">
              Logout
            </Button>
          </>
        )}
      </div>

    </header>
  );
}