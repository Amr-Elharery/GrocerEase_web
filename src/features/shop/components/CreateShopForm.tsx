import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { useCreateShop, useAreas } from "../hooks/useShop";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Store, Upload, X, MapPin, ChevronDown, Check } from "lucide-react";

function AreaDropdown({
  value,
  areas,
  onChange,
  hasError,
}: {
  value: string;
  areas: { id: number; area_name: string; city_name: string }[];
  onChange: (value: string) => void;
  hasError?: boolean;
}) {
  const { t } = useTranslation(["shop"]);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = areas.find((a) => String(a.id) === value);

  useEffect(() => {
    function onOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onOutside);
    return () => document.removeEventListener("mousedown", onOutside);
  }, []);

  return (
    <div ref={ref} className="relative w-full">
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className={`flex h-10 w-full items-center justify-between rounded-md border bg-white px-3 text-sm text-[#101828] shadow-sm transition hover:bg-[#F0FDF4] ${
          hasError ? "border-destructive" : "border-[#078A2D]"
        }`}
      >
        <span className={selected ? "" : "text-[#98A2B3]"}>
          {selected ? `${selected.area_name} — ${selected.city_name}` : t("shop:createShopForm.selectAreaPlaceholder")}
        </span>
        <ChevronDown className={`h-4 w-4 shrink-0 text-[#078A2D] transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute bottom-[48px] start-0 z-50 max-h-[240px] w-full overflow-y-auto rounded-lg border border-[#CDE8D5] bg-white shadow-[0_12px_30px_rgba(15,23,42,0.12)]">
          {areas.length === 0 && (
            <p className="px-3 py-2.5 text-sm text-[#98A2B3]">{t("shop:createShopForm.noAreasAvailable")}</p>
          )}
          {areas.map((a) => {
            const isSelected = String(a.id) === value;
            return (
              <button
                key={a.id}
                type="button"
                onClick={() => { onChange(String(a.id)); setOpen(false); }}
                className={`flex w-full items-center justify-between gap-3 px-3 py-2.5 text-start text-sm transition ${
                  isSelected ? "bg-[#EAF7EE] font-semibold text-[#078A2D]" : "text-[#101828] hover:bg-[#F0FDF4]"
                }`}
              >
                <span className="min-w-0 truncate">{a.area_name} — {a.city_name}</span>
                {isSelected && <Check className="h-4 w-4 shrink-0 text-[#078A2D]" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

type Errors = {
  shop_name?: string;
  area_id?: string;
};

export default function CreateShopForm() {
  const { t } = useTranslation(["common", "shop"]);
  const navigate = useNavigate();
  const createShop = useCreateShop();
  const { data: areas = [] } = useAreas();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    shop_name: "",
    description: "",
    address: "",
    phone_number: "",
    latitude: "",
    longitude: "",
    area_id: "",
  });
  const [logo, setLogo] = useState<File | null>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [serverError, setServerError] = useState("");

  const readApiError = (err: unknown): string => {
    const detail = (err as { data?: { detail?: unknown } })?.data?.detail;
    if (typeof detail === "string") return detail;
    if (Array.isArray(detail) && (detail[0] as { msg?: string })?.msg) {
      return (detail[0] as { msg: string }).msg;
    }
    return t("shop:createShopForm.genericError");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setServerError("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fieldErrors: Errors = {};
    if (!form.shop_name || form.shop_name.length < 2) {
      fieldErrors.shop_name = t("shop:createShopForm.shopNameRequired");
    }
    if (!form.area_id) {
      fieldErrors.area_id = t("shop:createShopForm.areaRequired");
    }
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setServerError("");

    createShop.mutate(
      {
        shop_name: form.shop_name,
        description: form.description || undefined,
        address: form.address || undefined,
        phone_number: form.phone_number || undefined,
        latitude: form.latitude ? Number(form.latitude) : undefined,
        longitude: form.longitude ? Number(form.longitude) : undefined,
        area_id: form.area_id ? Number(form.area_id) : undefined,
        logo: logo || undefined,
      },
      {
        onSuccess: () => navigate("/store/inventory"),
        onError: (err) => setServerError(readApiError(err)),
      }
    );
  };

  return (
    <section className="mx-auto max-w-2xl">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#1B4332] text-white">
          <Store className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-xl font-black text-[#101828]">{t("shop:createShopForm.title")}</h1>
          <p className="text-sm text-[#667085]">{t("shop:createShopForm.subtitle")}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}
        className="space-y-4 rounded-2xl border border-[#DDE7DF] bg-white p-5 shadow-sm">

        {serverError && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
            {serverError}
          </div>
        )}

        {/* Logo */}
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-[#101828]">{t("shop:createShopForm.logoLabel")}</Label>
          {logo ? (
            <div className="relative h-28 w-28 overflow-hidden rounded-xl border border-[#DDE7DF]">
              <img src={URL.createObjectURL(logo)} alt="" className="h-full w-full object-cover" />
              <button type="button" onClick={() => setLogo(null)}
                className="absolute end-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/50 text-white">
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <div onClick={() => fileInputRef.current?.click()}
              className="flex h-28 w-28 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#C9D8CE] bg-[#F8FAF8] text-center transition hover:border-[#1B4332]">
              <Upload className="mb-1 h-5 w-5 text-[#5F7168]" />
              <span className="text-[10px] font-medium text-[#5F7168]">{t("shop:createShopForm.uploadLogo")}</span>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden"
                onChange={(e) => setLogo(e.target.files?.[0] ?? null)} />
            </div>
          )}
        </div>

        {/* Shop Name */}
        <div className="space-y-1.5">
          <Label htmlFor="shop_name" className="text-xs font-semibold text-[#101828]">{t("shop:createShopForm.shopNameLabel")}</Label>
          <Input id="shop_name" name="shop_name" value={form.shop_name} onChange={handleChange}
            placeholder={t("shop:createShopForm.shopNamePlaceholder")}
            className={`h-10 ${errors.shop_name ? "border-destructive" : ""}`} />
          {errors.shop_name && <p className="text-xs text-destructive">{errors.shop_name}</p>}
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <Label htmlFor="description" className="text-xs font-semibold text-[#101828]">{t("shop:createShopForm.descriptionLabel")}</Label>
          <textarea id="description" name="description" value={form.description} onChange={handleChange}
            rows={2} placeholder={t("shop:createShopForm.descriptionPlaceholder")}
            className="w-full resize-none rounded-lg border border-[#DDE7DF] bg-[#F8FAF8] px-3 py-2 text-sm outline-none focus:border-[#2D6A4F]" />
        </div>

        {/* Address */}
        <div className="space-y-1.5">
          <Label htmlFor="address" className="text-xs font-semibold text-[#101828]">{t("shop:createShopForm.addressLabel")}</Label>
          <Input id="address" name="address" value={form.address} onChange={handleChange}
            placeholder={t("shop:createShopForm.addressPlaceholder")} className="h-10" />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {/* Phone */}
          <div className="space-y-1.5">
            <Label htmlFor="phone_number" className="text-xs font-semibold text-[#101828]">{t("shop:createShopForm.phoneNumberLabel")}</Label>
            <Input id="phone_number" name="phone_number" value={form.phone_number} onChange={handleChange}
              placeholder={t("shop:createShopForm.phoneNumberPlaceholder")} className="h-10" />
          </div>

          {/* Area */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-[#101828]">{t("shop:createShopForm.areaLabel")}</Label>
            <AreaDropdown
              value={form.area_id}
              areas={areas}
              hasError={!!errors.area_id}
              onChange={(val) => {
                setForm((prev) => ({ ...prev, area_id: val }));
                setErrors((prev) => ({ ...prev, area_id: undefined }));
              }}
            />
            {errors.area_id && <p className="text-xs text-destructive">{errors.area_id}</p>}
          </div>
        </div>

        {/* Coordinates */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="latitude" className="flex items-center gap-1 text-xs font-semibold text-[#101828]">
              <MapPin className="h-3.5 w-3.5" /> {t("shop:createShopForm.latitudeLabel")}
            </Label>
            <Input id="latitude" name="latitude" type="number" step="any" value={form.latitude} onChange={handleChange}
              placeholder={t("shop:createShopForm.latitudePlaceholder")} className="h-10" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="longitude" className="flex items-center gap-1 text-xs font-semibold text-[#101828]">
              <MapPin className="h-3.5 w-3.5" /> {t("shop:createShopForm.longitudeLabel")}
            </Label>
            <Input id="longitude" name="longitude" type="number" step="any" value={form.longitude} onChange={handleChange}
              placeholder={t("shop:createShopForm.longitudePlaceholder")} className="h-10" />
          </div>
        </div>

        <Button type="submit" disabled={createShop.isPending}
          className="h-11 w-full bg-[#1B4332] text-sm font-semibold text-white hover:bg-[#2D6A4F]">
          {createShop.isPending ? t("shop:createShopForm.creating") : t("shop:createShopForm.submit")}
        </Button>
      </form>
    </section>
  );
}