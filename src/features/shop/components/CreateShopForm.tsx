import { useState, useRef } from "react";
import { useNavigate } from "react-router";
import { useCreateShop } from "../hooks/useShop";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Store, Upload, X, MapPin } from "lucide-react";
import { z } from "zod";

const schema = z.object({
  shop_name: z.string().min(2, "Shop name is required"),
  area_id: z.string().min(1, "Area is required"),
});

type Errors = {
  shop_name?: string;
  area_id?: string;
};

function readApiError(err: unknown): string {
  const detail = (err as { data?: { detail?: unknown } })?.data?.detail;
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail) && (detail[0] as { msg?: string })?.msg) {
    return (detail[0] as { msg: string }).msg;
  }
  return "Something went wrong. Please try again.";
}

export default function CreateShopForm() {
  const navigate = useNavigate();
  const createShop = useCreateShop();
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setServerError("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = schema.safeParse({ shop_name: form.shop_name, area_id: form.area_id });
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
          <h1 className="text-xl font-black text-[#101828]">Create Your Shop</h1>
          <p className="text-sm text-[#667085]">Set up your store to start selling.</p>
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
          <Label className="text-xs font-semibold text-[#101828]">Shop Logo (optional)</Label>
          {logo ? (
            <div className="relative h-28 w-28 overflow-hidden rounded-xl border border-[#DDE7DF]">
              <img src={URL.createObjectURL(logo)} alt="" className="h-full w-full object-cover" />
              <button type="button" onClick={() => setLogo(null)}
                className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/50 text-white">
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <div onClick={() => fileInputRef.current?.click()}
              className="flex h-28 w-28 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#C9D8CE] bg-[#F8FAF8] text-center transition hover:border-[#1B4332]">
              <Upload className="mb-1 h-5 w-5 text-[#5F7168]" />
              <span className="text-[10px] font-medium text-[#5F7168]">Upload logo</span>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden"
                onChange={(e) => setLogo(e.target.files?.[0] ?? null)} />
            </div>
          )}
        </div>

        {/* Shop Name */}
        <div className="space-y-1.5">
          <Label htmlFor="shop_name" className="text-xs font-semibold text-[#101828]">Shop Name *</Label>
          <Input id="shop_name" name="shop_name" value={form.shop_name} onChange={handleChange}
            placeholder="e.g. Raghd Market"
            className={`h-10 ${errors.shop_name ? "border-destructive" : ""}`} />
          {errors.shop_name && <p className="text-xs text-destructive">{errors.shop_name}</p>}
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <Label htmlFor="description" className="text-xs font-semibold text-[#101828]">Description</Label>
          <textarea id="description" name="description" value={form.description} onChange={handleChange}
            rows={2} placeholder="Tell customers about your shop..."
            className="w-full resize-none rounded-lg border border-[#DDE7DF] bg-[#F8FAF8] px-3 py-2 text-sm outline-none focus:border-[#2D6A4F]" />
        </div>

        {/* Address */}
        <div className="space-y-1.5">
          <Label htmlFor="address" className="text-xs font-semibold text-[#101828]">Address</Label>
          <Input id="address" name="address" value={form.address} onChange={handleChange}
            placeholder="Street, area, city" className="h-10" />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {/* Phone */}
          <div className="space-y-1.5">
            <Label htmlFor="phone_number" className="text-xs font-semibold text-[#101828]">Phone Number</Label>
            <Input id="phone_number" name="phone_number" value={form.phone_number} onChange={handleChange}
              placeholder="e.g. 01012345678" className="h-10" />
          </div>

          {/* Area ID */}
          <div className="space-y-1.5">
            <Label htmlFor="area_id" className="text-xs font-semibold text-[#101828]">Area ID *</Label>
            <Input id="area_id" name="area_id" type="number" value={form.area_id} onChange={handleChange}
              placeholder="e.g. 1"
              className={`h-10 ${errors.area_id ? "border-destructive" : ""}`} />
            {errors.area_id && <p className="text-xs text-destructive">{errors.area_id}</p>}
          </div>
        </div>

        {/* Coordinates */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="latitude" className="flex items-center gap-1 text-xs font-semibold text-[#101828]">
              <MapPin className="h-3.5 w-3.5" /> Latitude
            </Label>
            <Input id="latitude" name="latitude" type="number" step="any" value={form.latitude} onChange={handleChange}
              placeholder="e.g. 30.0444" className="h-10" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="longitude" className="flex items-center gap-1 text-xs font-semibold text-[#101828]">
              <MapPin className="h-3.5 w-3.5" /> Longitude
            </Label>
            <Input id="longitude" name="longitude" type="number" step="any" value={form.longitude} onChange={handleChange}
              placeholder="e.g. 31.2357" className="h-10" />
          </div>
        </div>

        <Button type="submit" disabled={createShop.isPending}
          className="h-11 w-full bg-[#1B4332] text-sm font-semibold text-white hover:bg-[#2D6A4F]">
          {createShop.isPending ? "Creating shop..." : "Create Shop"}
        </Button>
      </form>
    </section>
  );
}
