import { useState } from "react";
import { Link } from "react-router-dom";
import { useRegister } from "@/features/auth/hooks/useAuth";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Eye, EyeOff } from "lucide-react";

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);

  const register = useRegister();

  const handleSubmit = (e) => {
    e.preventDefault();
    register.mutate({ name, email, password });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar variant="auth" />

      <main className="relative h-[calc(100vh-64px)] flex items-center justify-center overflow-hidden">
      
        {/* Card */}
        <Card className="relative z-10 w-full max-w-md mx-4 shadow-xl border-border/50">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
            <CardDescription>Start managing your inventory today</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
              {/* Name */}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="ex: Raghd Ahmed"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder=" ex: Raghd@Zad.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={show ? "text" : "password"}
                    placeholder="Min. 6 characters"
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

              {/* Submit */}
              <Button type="submit" className="w-full mt-1" disabled={register.isPending}>
                {register.isPending ? "Creating account..." : "Create Account →"}
              </Button>

              {/* Login link */}
              <p className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link to="/" className="font-semibold text-primary hover:underline">
                  Sign In
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
