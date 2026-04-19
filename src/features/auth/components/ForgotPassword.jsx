import { useState } from "react";
import { Link } from "react-router-dom";
import { useForgotPassword } from "../hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft, CheckCircle2 } from "lucide-react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const forgotPassword = useForgotPassword();

  const handleSubmit = (e) => {
    e.preventDefault();
    forgotPassword.mutate(email);
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="relative h-screen flex items-center justify-center overflow-hidden">

        {/* Card */}
        <Card className="relative z-10 w-full max-w-sm mx-4 shadow-xl border-border/50 ">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl font-bold">Forgot Password</CardTitle>
            <CardDescription>Enter your email to receive a reset link</CardDescription>
          </CardHeader>

          <CardContent>
            {forgotPassword.isSuccess ? (
              <div className="flex flex-col items-center gap-3 py-4 text-center">
                <CheckCircle2 className="w-12 h-12 text-primary" />
                <p className="font-semibold text-foreground">Check your email!</p>
                <p className="text-sm text-muted-foreground">We sent a reset link to <span className="font-medium text-foreground">{email}</span></p>
                <Button asChild variant="outline" className="mt-2 w-full">
                  <Link to="/">Back to Sign In</Link>
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="email">Email address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@zad.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <Button type="submit" className="w-full" disabled={forgotPassword.isPending}>
                  {forgotPassword.isPending ? "Sending..." : "Send Reset Link"}
                </Button>

                <Button asChild variant="ghost" className="w-full gap-2">
                  <Link to="/"><ArrowLeft className="w-4 h-4" /> Back to Sign In</Link>
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
