import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useChangePassword } from "../hooks/useChangePassword";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Lock, CheckCircle2, X, KeyRound } from "lucide-react";
import { z } from "zod";

const schema = z.object({
  currentPassword: z.string().min(1, "changePassword.errors.currentPasswordRequired"),
  newPassword: z.string().min(6, "changePassword.errors.newPasswordMin"),
  confirmPassword: z.string(),
}).refine((d) => d.newPassword === d.confirmPassword, {
  message: "changePassword.errors.passwordsDoNotMatch",
  path: ["confirmPassword"],
});

type Errors = {
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
};

export default function ChangePassword() {
  const { t } = useTranslation(["common", "auth"]);
  const [open, setOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [serverError, setServerError] = useState("");
  const changePassword = useChangePassword();

  function readApiError(err: unknown): string {
    const detail = (err as { data?: { detail?: unknown } })?.data?.detail;
    if (typeof detail === "string") {
      if (detail.toLowerCase().includes("incorrect") || detail.toLowerCase().includes("invalid")) {
        return t("auth:changePassword.errors.currentPasswordIncorrect");
      }
      return detail;
    }
    if (Array.isArray(detail) && (detail[0] as { msg?: string })?.msg) {
      return (detail[0] as { msg: string }).msg;
    }
    return t("auth:changePassword.errors.generic");
  }

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
        fieldErrors[field] = t(`auth:${err.message}`);
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
  className="flex items-center gap-1.5 rounded-xl bg-white px-3 py-2 text-xs font-bold text-[#1B4332] hover:bg-[#E6F3EB]"
>
  <KeyRound className="h-3.5 w-3.5" />
  {t("auth:changePassword.trigger")}
</button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
          onClick={close}>
          <div className="w-full max-w-md rounded-xl bg-white p-5 shadow-xl"
            onClick={(e) => e.stopPropagation()}>

            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-[15px] font-bold text-[#101828]">{t("auth:changePassword.title")}</h2>
                <p className="mt-0.5 text-xs text-[#667085]">{t("auth:changePassword.subtitle")}</p>
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
                <p className="text-sm font-semibold text-[#101828]">{t("auth:changePassword.successMessage")}</p>
                <Button type="button" onClick={close}
                  className="bg-[#1B4332] hover:bg-[#2D6A4F] text-white h-10 text-sm font-semibold">
                  {t("auth:changePassword.done")}
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="currentPassword">{t("auth:changePassword.currentPasswordLabel")}</Label>
                  <div className="relative">
                    <Lock className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input id="currentPassword" type={showCurrent ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setCurrentPassword(e.target.value); setServerError(""); }}
                      className={`ps-9 pe-10 ${errors.currentPassword || serverError ? "border-destructive" : ""}`} />
                    <button type="button" onClick={() => setShowCurrent(!showCurrent)}
                      className="absolute end-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                      {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.currentPassword && <p className="text-xs text-destructive">{errors.currentPassword}</p>}
                  {serverError && <p className="text-xs text-destructive">{serverError}</p>}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="newPassword">{t("auth:changePassword.newPasswordLabel")}</Label>
                  <div className="relative">
                    <Lock className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input id="newPassword" type={showNew ? "text" : "password"}
                      value={newPassword}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewPassword(e.target.value)}
                      className={`ps-9 pe-10 ${errors.newPassword ? "border-destructive" : ""}`} />
                    <button type="button" onClick={() => setShowNew(!showNew)}
                      className="absolute end-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                      {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.newPassword && <p className="text-xs text-destructive">{errors.newPassword}</p>}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="confirmPassword">{t("auth:changePassword.confirmPasswordLabel")}</Label>
                  <div className="relative">
                    <Lock className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input id="confirmPassword" type="password"
                      value={confirmPassword}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
                      className={`ps-9 ${errors.confirmPassword ? "border-destructive" : ""}`} />
                  </div>
                  {errors.confirmPassword && <p className="text-xs text-destructive">{errors.confirmPassword}</p>}
                </div>

                <div className="flex justify-end gap-2 pt-1">
                  <Button type="button" variant="outline" onClick={close}
                    className="h-10 rounded-lg border-[#DDE7DF] px-4 text-sm font-semibold">
                    {t("common:actions.cancel")}
                  </Button>
                  <Button type="submit" disabled={changePassword.isPending}
                    className="bg-[#1B4332] hover:bg-[#2D6A4F] text-white h-10 text-sm font-semibold">
                    {changePassword.isPending ? t("auth:changePassword.updating") : t("auth:changePassword.submit")}
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
