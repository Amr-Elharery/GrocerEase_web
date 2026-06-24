import { useState } from "react";
import { useChangePassword } from "../hooks/useChangePassword";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Lock, CheckCircle2, X, KeyRound } from "lucide-react";
import { z } from "zod";

const schema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((d) => d.newPassword === d.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type Errors = {
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
};

function readApiError(err: unknown): string {
  const detail = (err as { data?: { detail?: unknown } })?.data?.detail;
  if (typeof detail === "string") {
    if (detail.toLowerCase().includes("incorrect") || detail.toLowerCase().includes("invalid")) {
      return "Current password is incorrect.";
    }
    return detail;
  }
  if (Array.isArray(detail) && (detail[0] as { msg?: string })?.msg) {
    return (detail[0] as { msg: string }).msg;
  }
  return "Something went wrong. Please try again.";
}

export default function ChangePassword() {
  const [open, setOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [serverError, setServerError] = useState("");
  const changePassword = useChangePassword();

  const resetForm = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setErrors({});
    setServerError("");
    changePassword.reset();
  };

  const close = () => {
    if (changePassword.isPending) return;
    setOpen(false);
    resetForm();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = schema.safeParse({ currentPassword, newPassword, confirmPassword });
    if (!result.success) {
      const fieldErrors: Errors = {};
      result.error.issues.forEach((err) => {
        const field = err.path[0] as keyof Errors;
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setServerError("");
    changePassword.mutate(
      { current_password: currentPassword, new_password: newPassword },
      {
        onSuccess: () => {
          setCurrentPassword("");
          setNewPassword("");
          setConfirmPassword("");
        },
        onError: (err) => setServerError(readApiError(err)),
      }
    );
  };

  return (
    <>
     <button
  type="button"
  onClick={() => setOpen(true)}
  className="ml-auto flex h-10 items-center gap-2 rounded-lg bg-[#006B22] px-4 text-sm font-semibold text-white transition hover:bg-[#00571C]"
>
  <KeyRound className="h-4 w-4" />
  Change Password
</button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
          onClick={close}>
          <div className="w-full max-w-md rounded-xl bg-white p-5 shadow-xl"
            onClick={(e) => e.stopPropagation()}>

            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-[15px] font-bold text-[#101828]">Change Password</h2>
                <p className="mt-0.5 text-xs text-[#667085]">Update your account password.</p>
              </div>
              <button type="button" onClick={close}
                className="rounded-lg p-1 text-[#5F7168] transition hover:bg-[#F3F4F6]">
                <X className="h-4 w-4" />
              </button>
            </div>

            {changePassword.isSuccess ? (
              <div className="mt-4 flex flex-col items-center gap-3 py-6 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
                  <CheckCircle2 className="h-7 w-7 text-[#2D6A4F]" />
                </div>
                <p className="text-sm font-semibold text-[#101828]">Password updated successfully.</p>
                <Button type="button" onClick={close}
                  className="bg-[#1B4332] hover:bg-[#2D6A4F] text-white h-10 text-sm font-semibold">
                  Done
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input id="currentPassword" type={showCurrent ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setCurrentPassword(e.target.value); setServerError(""); }}
                      className={`pl-9 pr-10 ${errors.currentPassword || serverError ? "border-destructive" : ""}`} />
                    <button type="button" onClick={() => setShowCurrent(!showCurrent)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                      {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.currentPassword && <p className="text-xs text-destructive">{errors.currentPassword}</p>}
                  {serverError && <p className="text-xs text-destructive">{serverError}</p>}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="newPassword">New Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input id="newPassword" type={showNew ? "text" : "password"}
                      value={newPassword}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewPassword(e.target.value)}
                      className={`pl-9 pr-10 ${errors.newPassword ? "border-destructive" : ""}`} />
                    <button type="button" onClick={() => setShowNew(!showNew)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                      {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.newPassword && <p className="text-xs text-destructive">{errors.newPassword}</p>}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input id="confirmPassword" type="password"
                      value={confirmPassword}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
                      className={`pl-9 ${errors.confirmPassword ? "border-destructive" : ""}`} />
                  </div>
                  {errors.confirmPassword && <p className="text-xs text-destructive">{errors.confirmPassword}</p>}
                </div>

                <div className="flex justify-end gap-2 pt-1">
                  <Button type="button" variant="outline" onClick={close}
                    className="h-10 rounded-lg border-[#DDE7DF] px-4 text-sm font-semibold">
                    Cancel
                  </Button>
                  <Button type="submit" disabled={changePassword.isPending}
                    className="bg-[#1B4332] hover:bg-[#2D6A4F] text-white h-10 text-sm font-semibold">
                    {changePassword.isPending ? "Updating..." : "Update Password"}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
