import { useState } from "react";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import { useLogin } from "../hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("login.errors.invalidEmail"),
  password: z.string().min(6, "login.errors.passwordMin"),
});

type LoginErrors = {
  email?: string;
  password?: string;
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

export default function Login() {
  const { t } = useTranslation("auth");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [errors, setErrors] = useState<LoginErrors>({});
  const [serverError, setServerError] = useState("");
  const login = useLogin();

  function readApiError(err: unknown): string {
    const detail = (err as { data?: { detail?: unknown } })?.data?.detail;
    if (typeof detail === "string") {
      if (detail.toLowerCase().includes("invalid")) return t("login.errors.wrongCredentials");
      return detail;
    }
    if (Array.isArray(detail) && (detail[0] as { msg?: string })?.msg) {
      return (detail[0] as { msg: string }).msg;
    }
    if (err) return `${err}`;
    return t("login.errors.generic");
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      const fieldErrors: LoginErrors = {};
      result.error.issues.forEach((err) => {
        const field = err.path[0] as keyof LoginErrors;
        fieldErrors[field] = t(err.message);
      });
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setServerError("");
    login.mutate(result.data, {
      onError: (err) => setServerError(readApiError(err)),
    });
  };

  return (
    <div className="w-full space-y-6">
      <div className="text-center space-y-1">
        <ZADLogo />
        <h1 className="text-2xl font-bold text-foreground">{t("login.title")}</h1>
        <p className="text-sm text-muted-foreground">{t("login.subtitle")}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="email">{t("login.emailLabel")}</Label>
          <div className="relative">
            <Mail className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input id="email" type="email" placeholder={t("login.emailPlaceholder")} value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              className={`ps-9 ${errors.email ? "border-destructive" : ""}`} />
          </div>
          {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">{t("login.passwordLabel")}</Label>
            <Link to="/auth/forgot-password" className="text-xs font-semibold text-[#2D6A4F] hover:underline">
              {t("login.forgotPassword")}
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input id="password" type={show ? "text" : "password"} placeholder={t("login.passwordPlaceholder")}
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setPassword(e.target.value); setServerError(""); }}
              className={`ps-9 pe-10 ${errors.password || serverError ? "border-destructive" : ""}`} />
            <button type="button" onClick={() => setShow(!show)}
              className="absolute end-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
              {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
          {serverError && <p className="text-xs text-destructive">{serverError}</p>}
        </div>

        <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
          <input type="checkbox" className="w-4 h-4 accent-[#2D6A4F]" />
          {t("login.rememberMe")}
        </label>

        <Button type="submit" className="w-full bg-[#1B4332] hover:bg-[#2D6A4F] text-white h-11 text-sm font-semibold"
          disabled={login.isPending}>
          {login.isPending ? t("login.signingIn") : t("login.submit")}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        {t("login.noAccount")}{" "}
        <Link to="/auth/signup" className="font-semibold text-[#2D6A4F] hover:underline">{t("login.signUp")}</Link>
      </p>
    </div>
  );
}
