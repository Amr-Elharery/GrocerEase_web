import { useState } from "react";
import { useParams } from "react-router-dom";
import { useResetPassword } from "../hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Eye, EyeOff } from "lucide-react";

export default function ResetPassword() {
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const resetPassword = useResetPassword();

  const handleSubmit = (e) => {
    e.preventDefault();
    resetPassword.mutate({ token, newPassword, confirmPassword });
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="relative h-screen flex items-center justify-center overflow-hidden">
    

        {/* Card */}
        <Card className="relative z-10 w-full max-w-sm mx-4 shadow-xl border-border/50">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
            <CardDescription>Enter your new password below</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
              {/* New Password */}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="newPassword">New Password</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showNew ? "text" : "password"}
                    placeholder="Min. 6 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirm ? "text" : "password"}
                    placeholder="Repeat your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Passwords match indicator */}
              {confirmPassword && (
                <p className={`text-xs font-medium ${newPassword === confirmPassword ? "text-primary" : "text-destructive"}`}>
                  {newPassword === confirmPassword ? "✓ Passwords match" : "✗ Passwords do not match"}
                </p>
              )}

              <Button type="submit" className="w-full mt-1" disabled={resetPassword.isPending}>
                {resetPassword.isPending ? "Resetting..." : "Reset Password"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
