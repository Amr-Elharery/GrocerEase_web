import { useState } from "react";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import { useRegister } from "@/features/auth/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Mail, Lock, User, Phone } from "lucide-react";
import { z } from "zod";

const signUpSchema = z.object({
  name: z.string().min(2, "signUp.errors.nameMin"),
  email: z.string().email("signUp.errors.invalidEmail"),
  phone: z.string().min(8, "signUp.errors.invalidPhone"),
  password: z.string().min(6, "signUp.errors.passwordMin"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "signUp.errors.passwordsDoNotMatch",
  path: ["confirmPassword"],
});

type SignUpErrors = {
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
  confirmPassword?: string;
};

function toE164(raw: string): string {
  const trimmed = raw.replace(/\s|-/g, "");
  if (trimmed.startsWith("+")) return trimmed;
  if (trimmed.startsWith("00")) return "+" + trimmed.slice(2);
  if (trimmed.startsWith("0")) return "+20" + trimmed.slice(1);
  return "+20" + trimmed;
}

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

export default function SignUp() {
  const { t } = useTranslation("auth");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [accountType, setAccountType] = useState<"admin" | "vendor">("admin");
  const [show, setShow] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState<SignUpErrors>({});
  const [serverError, setServerError] = useState("");
  const register = useRegister();

  function readApiError(err: unknown): string {
    const detail = (err as { data?: { detail?: unknown } })?.data?.detail;
    if (typeof detail === "string") {
      if (detail.toLowerCase().includes("already")) return t("signUp.errors.emailTaken");
      return detail;
    }
    if (Array.isArray(detail) && detail[0]?.msg) return detail[0].msg;
    return t("signUp.errors.generic");
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = signUpSchema.safeParse({ name, email, phone, password, confirmPassword });
    if (!result.success) {
      const fieldErrors: SignUpErrors = {};
      result.error.issues.forEach((err) => {
        const field = err.path[0] as keyof SignUpErrors;
        fieldErrors[field] = t(err.message);
      });
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setServerError("");
    register.mutate({
      full_name: name,
      email,
      phone: toE164(phone),
      password,
      confirmPassword,
      accountType,
    }, {
      onError: (err) => setServerError(readApiError(err)),
    });
  };

  return (
    <div className="w-full space-y-6">
      <div className="text-center space-y-1">
        <ZADLogo />
        <h1 className="text-2xl font-bold text-foreground">{t("signUp.title")}</h1>
        <p className="text-sm text-muted-foreground">{t("signUp.subtitle")}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label>{t("signUp.accountTypeLabel")}</Label>
          <div className="grid grid-cols-2 gap-2">
            <button type="button" onClick={() => setAccountType("admin")}
              className={`h-10 rounded-lg border text-sm font-semibold transition ${
                accountType === "admin"
                  ? "border-[#1B4332] bg-[#1B4332] text-white"
                  : "border-[#DDE7DF] bg-white text-[#5F7168] hover:bg-[#F8FAF8]"
              }`}>
              {t("signUp.accountTypeAdmin")}
            </button>
            <button type="button" onClick={() => setAccountType("vendor")}
              className={`h-10 rounded-lg border text-sm font-semibold transition ${
                accountType === "vendor"
                  ? "border-[#1B4332] bg-[#1B4332] text-white"
                  : "border-[#DDE7DF] bg-white text-[#5F7168] hover:bg-[#F8FAF8]"
              }`}>
              {t("signUp.accountTypeVendor")}
            </button>
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="name">{t("signUp.nameLabel")}</Label>
          <div className="relative">
            <User className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input id="name" type="text" placeholder={t("signUp.namePlaceholder")} value={name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
              className={`ps-9 ${errors.name ? "border-destructive" : ""}`} />
          </div>
          {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email">{t("signUp.emailLabel")}</Label>
          <div className="relative">
            <Mail className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input id="email" type="email" placeholder={t("signUp.emailPlaceholder")} value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setEmail(e.target.value); setServerError(""); }}
              className={`ps-9 ${errors.email || serverError ? "border-destructive" : ""}`} />
          </div>
          {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
          {serverError && <p className="text-xs text-destructive">{serverError}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="phone">{t("signUp.phoneLabel")}</Label>
          <div className="relative">
            <Phone className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input id="phone" type="tel" placeholder={t("signUp.phonePlaceholder")} value={phone}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPhone(e.target.value)}
              className={`ps-9 ${errors.phone ? "border-destructive" : ""}`} />
          </div>
          {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password">{t("signUp.passwordLabel")}</Label>
          <div className="relative">
            <Lock className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input id="password" type={show ? "text" : "password"} placeholder={t("signUp.passwordPlaceholder")}
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              className={`ps-9 pe-10 ${errors.password ? "border-destructive" : ""}`} />
            <button type="button" onClick={() => setShow(!show)}
              className="absolute end-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
              {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="confirmPassword">{t("signUp.confirmPasswordLabel")}</Label>
          <div className="relative">
            <Lock className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input id="confirmPassword" type={showConfirm ? "text" : "password"}
              placeholder={t("signUp.confirmPasswordPlaceholder")}
              value={confirmPassword}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
              className={`ps-9 pe-10 ${errors.confirmPassword ? "border-destructive" : ""}`} />
            <button type="button" onClick={() => setShowConfirm(!showConfirm)}
              className="absolute end-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
              {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.confirmPassword && <p className="text-xs text-destructive">{errors.confirmPassword}</p>}
        </div>

        <Button type="submit" className="w-full bg-[#1B4332] hover:bg-[#2D6A4F] text-white h-11 text-sm font-semibold"
          disabled={register.isPending}>
          {register.isPending ? t("signUp.creating") : t("signUp.submit")}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        {t("signUp.haveAccount")}{" "}
        <Link to="/auth/login" className="font-semibold text-[#2D6A4F] hover:underline">{t("signUp.signIn")}</Link>
      </p>
    </div>
  );
}
