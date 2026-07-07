import { useState } from "react";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import { useForgotPassword } from "../hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, CheckCircle2, ArrowLeft } from "lucide-react";
import { z } from "zod";

const forgotSchema = z.object({
  email: z.string().email("forgotPassword.errors.invalidEmail"),
});

type ForgotErrors = {
  email?: string;
};

const ZADLogo = () => (
  <div dir="ltr" className="flex items-center justify-center gap-1 mb-4">
    <svg width="36" height="44" viewBox="0 0 32 38" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="zGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#52B788" />
          <stop offset="100%" stopColor="#1B4332" />
        </linearGradient>
      </defs>
      <path d="M3 3H29L7 35H29" stroke="url(#zGrad)" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
    <span className="text-4xl font-bold text-[#1a1f2e] tracking-tight">AD</span>
  </div>
);

export default function ForgotPassword() {
  const { t } = useTranslation("auth");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<ForgotErrors>({});
  const forgotPassword = useForgotPassword();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = forgotSchema.safeParse({ email });
    if (!result.success) {
      const fieldErrors: ForgotErrors = {};
      result.error.issues.forEach((err) => {
        const field = err.path[0] as keyof ForgotErrors;
        fieldErrors[field] = t(err.message);
      });
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    forgotPassword.mutate(result.data.email);
  };

  return (
    <div className="w-full space-y-6">
      {forgotPassword.isSuccess ? (
        <div className="flex flex-col items-center text-center space-y-4 py-8">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8 text-[#2D6A4F]" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">{t("forgotPassword.checkEmailTitle")}</h1>
          <p className="text-sm text-muted-foreground">
            {t("forgotPassword.checkEmailMessage")}{" "}
            <span className="font-semibold text-foreground">{email}</span>
          </p>
          <Button asChild className="w-full bg-[#1B4332] hover:bg-[#2D6A4F] text-white h-11 mt-4">
            <Link to="/auth/login">{t("forgotPassword.backToSignIn")}</Link>
          </Button>
        </div>
      ) : (
        <>
          <div className="text-center space-y-1">
            <ZADLogo />
            <h1 className="text-2xl font-bold text-foreground">{t("forgotPassword.title")}</h1>
            <p className="text-sm text-muted-foreground">
              {t("forgotPassword.subtitle")}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">{t("forgotPassword.emailLabel")}</Label>
              <div className="relative">
                <Mail className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input id="email" type="email" placeholder={t("forgotPassword.emailPlaceholder")} value={email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                  className={`ps-9 ${errors.email ? "border-destructive" : ""}`} />
              </div>
              {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
            </div>

            <Button type="submit" className="w-full bg-[#1B4332] hover:bg-[#2D6A4F] text-white h-11 text-sm font-semibold"
              disabled={forgotPassword.isPending}>
              {forgotPassword.isPending ? t("forgotPassword.sending") : t("forgotPassword.submit")}
            </Button>
          </form>

          <Link to="/auth/login"
            className="flex items-center justify-center gap-2 text-sm text-[#2D6A4F] hover:underline">
            <ArrowLeft className="w-4 h-4" /> {t("forgotPassword.backToSignIn")}
          </Link>
        </>
      )}
    </div>
  );
}
