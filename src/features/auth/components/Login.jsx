import { useState } from "react";
import { Link } from "react-router-dom";
import { useLogin } from "../hooks/useAuth";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Eye, EyeOff } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);

  const login = useLogin();

  const handleSubmit = (e) => {
    e.preventDefault();
    login.mutate({ email, password });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar variant="auth" />

      <main className="relative h-[calc(100vh-64px)] flex items-center justify-center overflow-hidden">
  

        {/* Card */}
        <Card className="relative z-10 w-full max-w-md mx-4 shadow-xl border-border/50">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
            <CardDescription>Sign in to manage your inventory</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@zad.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    to="/forgot-password"
                    className="text-xs font-semibold text-primary hover:underline"
                  >
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={show ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShow(!show)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember me */}
              <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
                <input type="checkbox" className="w-4 h-4 accent-primary" />
                <span>Remember me</span>
              </label>

              {/* Submit */}
              <Button type="submit" className="w-full mt-1" disabled={login.isPending}>
                {login.isPending ? "Signing in..." : "Sign In →"}
              </Button>

              {/* Sign up link */}
              <p className="text-center text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link to="/signup" className="font-semibold text-primary hover:underline">
                  Sign Up
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
