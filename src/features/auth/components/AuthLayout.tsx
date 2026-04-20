import { Outlet, Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Leaf } from "lucide-react";

export default function AuthLayout() {
  return (
    <div className="min-h-screen">
      <header className="h-16 bg-white border-b border-border flex items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2 no-underline">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Leaf className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-bold text-primary text-lg tracking-tight">ZAD</span>
        </Link>

        <nav className="flex items-center gap-6">
          <Link to="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Home
          </Link>
        </nav>

        <Button asChild size="sm" className="rounded-full">
          <Link to="/auth/signup">Sign Up</Link>
        </Button>
      </header>

      <Outlet />
    </div>
  );
}