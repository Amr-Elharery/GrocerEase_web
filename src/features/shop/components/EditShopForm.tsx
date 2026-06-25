import { useState, useRef } from "react";
import { useNavigate } from "react-router";
import { useMyShop, useUpdateShop, useDeleteShop } from "../hooks/useShop";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Store, Upload, X, MapPin, Trash2, AlertTriangle, Pencil, Save } from "lucide-react";

function readApiError(err: unknown): string {
  const detail = (err as { data?: { detail?: unknown } })?.data?.detail;
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail) && (detail[0] as { msg?: string })?.msg) {
    return (detail[0] as { msg: string }).msg;
  }
  return "Something went wrong. Please try again.";
}

function ViewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <p className="text-xs font-semibold text-[#667085]">{label}</p>
      <div className="flex min-h-10 items-center rounded-lg border border-[#DFE7E1] bg-[#F8FAF8] px-3 py-2 text-sm text-[#101828]">
        {value || <span className="text-[#98A2B3]">—</span>}
      </div>
    </div>
  );
}

export default function EditShopForm() {
  const navigate = useNavigate();
  const { data: shop, isLoading } = useMyShop();
  const updateShop = useUpdateShop();
  const deleteShop = useDeleteShop();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [editMode, setEditMode] = useState(false);
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
  const [serverError, setServerError] = useState("");
  const [savedMsg, setSavedMsg] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const [loadedShopId, setLoadedShopId] = useState<number | null>(null);
  if (shop && shop.id !== loadedShopId) {
    setLoadedShopId(shop.id);
    setForm({
      shop_name: shop.shop_name ?? "",
      description: shop.description ?? "",
      address: shop.address ?? "",
      phone_number: shop.phone_number ?? "",
      latitude: shop.latitude != null ? String(shop.latitude) : "",
      longitude: shop.longitude != null ? String(shop.longitude) : "",
      area_id: shop.area_id != null ? String(shop.area_id) : "",
    });
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setServerError("");
    setSavedMsg(false);
  };

  const startEdit = () => {
    setEditMode(true);
    setSavedMsg(false);
    setServerError("");
  };

  const cancelEdit = () => {
    if (shop) {
      setForm({
        shop_name: shop.shop_name ?? "",
        description: shop.description ?? "",
        address: shop.address ?? "",
        phone_number: shop.phone_number ?? "",
        latitude: shop.latitude != null ? String(shop.latitude) : "",
        longitude: shop.longitude != null ? String(shop.longitude) : "",
        area_id: shop.area_id != null ? String(shop.area_id) : "",
      });
    }
    setLogo(null);
    setEditMode(false);
    setServerError("");
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shop) return;
    if (!form.shop_name || form.shop_name.length < 2) {
      setServerError("Shop name is required.");
      return;
    }
    setServerError("");

    updateShop.mutate(
      {
        shopId: shop.id,
        payload: {
          shop_name: form.shop_name,
          description: form.description || undefined,
          address: form.address || undefined,
          phone_number: form.phone_number || undefined,
          latitude: form.latitude ? Number(form.latitude) : undefined,
          longitude: form.longitude ? Number(form.longitude) : undefined,
          area_id: form.area_id ? Number(form.area_id) : undefined,
          logo: logo || undefined,
        },
      },
      {
        onSuccess: () => { setSavedMsg(true); setLogo(null); setEditMode(false); },
        onError: (err) => setServerError(readApiError(err)),
      }
    );
  };

  const handleDelete = () => {
    if (!shop) return;
    deleteShop.mutate(shop.id, {
      onSuccess: () => navigate("/store/create-shop"),
      onError: (err) => { setServerError(readApiError(err)); setConfirmDelete(false); },
    });
  };

  if (isLoading) {
    return (
      <section className="flex min-h-[300px] items-center justify-center">
        <p className="text-sm text-[#667085]">Loading shop...</p>
      </section>
    );
  }


  return (
    <section className="mx-auto max-w-2xl">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#1B4332] text-white">
            <Store className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-black text-[#101828]">Shop Settings</h1>
            <p className="text-sm text-[#667085]">View, edit, or delete your shop.</p>
          </div>
        </div>

        {!editMode && (
          <Button type="button" onClick={startEdit}
            className="h-10 gap-2 bg-[#1B4332] px-4 text-sm font-semibold text-white hover:bg-[#2D6A4F]">
            <Pencil className="h-4 w-4" /> Edit
          </Button>
        )}
      </div>

      <div className="space-y-4 rounded-2xl border border-[#DDE7DF] bg-white p-5 shadow-sm">

        {serverError && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
            {serverError}
          </div>
        )}
        {savedMsg && (
          <div className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-[#2D6A4F]">
            Shop updated successfully.
          </div>
        )}

        {/* Logo */}
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-[#101828]">Shop Logo</Label>
          {editMode ? (
            logo ? (
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
            )
          ) : (
            <div className="h-28 w-28 overflow-hidden rounded-xl border border-[#DDE7DF] bg-[#F8FAF8]">
              {shop?.logo_url ? (
                <img src={shop.logo_url} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-[#98A2B3]">
                  <Store className="h-6 w-6" />
                </div>
              )}
            </div>
          )}
        </div>

        {editMode ? (
          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="shop_name" className="text-xs font-semibold text-[#101828]">Shop Name *</Label>
              <Input id="shop_name" name="shop_name" value={form.shop_name} onChange={handleChange} className="h-10" />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="description" className="text-xs font-semibold text-[#101828]">Description</Label>
              <textarea id="description" name="description" value={form.description} onChange={handleChange} rows={2}
                className="w-full resize-none rounded-lg border border-[#DDE7DF] bg-[#F8FAF8] px-3 py-2 text-sm outline-none focus:border-[#2D6A4F]" />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="address" className="text-xs font-semibold text-[#101828]">Address</Label>
              <Input id="address" name="address" value={form.address} onChange={handleChange} className="h-10" />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="phone_number" className="text-xs font-semibold text-[#101828]">Phone Number</Label>
                <Input id="phone_number" name="phone_number" value={form.phone_number} onChange={handleChange} className="h-10" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="area_id" className="text-xs font-semibold text-[#101828]">Area ID *</Label>
                <Input id="area_id" name="area_id" type="number" value={form.area_id} onChange={handleChange} className="h-10" />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="latitude" className="flex items-center gap-1 text-xs font-semibold text-[#101828]">
                  <MapPin className="h-3.5 w-3.5" /> Latitude
                </Label>
                <Input id="latitude" name="latitude" type="number" step="any" value={form.latitude} onChange={handleChange} className="h-10" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="longitude" className="flex items-center gap-1 text-xs font-semibold text-[#101828]">
                  <MapPin className="h-3.5 w-3.5" /> Longitude
                </Label>
                <Input id="longitude" name="longitude" type="number" step="any" value={form.longitude} onChange={handleChange} className="h-10" />
              </div>
            </div>

            <div className="flex gap-2 pt-1">
              <Button type="submit" disabled={updateShop.isPending}
                className="h-11 flex-1 gap-2 bg-[#1B4332] text-sm font-semibold text-white hover:bg-[#2D6A4F]">
                <Save className="h-4 w-4" /> {updateShop.isPending ? "Saving..." : "Save Changes"}
              </Button>
              <Button type="button" variant="outline" onClick={cancelEdit}
                className="h-11 px-4 text-sm font-semibold">
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <>
            <ViewRow label="Shop Name" value={shop?.shop_name ?? ""} />
            <ViewRow label="Description" value={shop?.description ?? ""} />
            <ViewRow label="Address" value={shop?.address ?? ""} />
            <div className="grid gap-4 md:grid-cols-2">
              <ViewRow label="Phone Number" value={shop?.phone_number ?? ""} />
              <ViewRow label="Area ID" value={shop?.area_id != null ? String(shop.area_id) : ""} />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <ViewRow label="Latitude" value={shop?.latitude != null ? String(shop.latitude) : ""} />
              <ViewRow label="Longitude" value={shop?.longitude != null ? String(shop.longitude) : ""} />
            </div>

            {/* Delete */}
            <div className="mt-2 flex justify-end border-t border-[#EEF2EF] pt-4">
              <Button type="button" variant="outline" onClick={() => setConfirmDelete(true)}
                className="h-10 gap-2 border-red-200 px-4 text-sm font-semibold text-red-600 hover:bg-red-50">
                <Trash2 className="h-4 w-4" /> Delete Shop
              </Button>
            </div>
          </>
        )}
      </div>

      {/* Delete confirmation modal */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
          onClick={() => setConfirmDelete(false)}>
          <div className="w-full max-w-sm rounded-xl bg-white p-5 shadow-xl"
            onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-[#101828]">Delete Shop?</h2>
                <p className="mt-1 text-sm text-[#667085]">
                  This will permanently delete "{shop?.shop_name}". You'll need to create a new shop to continue.
                </p>
              </div>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setConfirmDelete(false)}
                className="h-10 px-4 text-sm font-semibold">
                Cancel
              </Button>
              <Button type="button" onClick={handleDelete} disabled={deleteShop.isPending}
                className="h-10 bg-red-600 px-4 text-sm font-semibold text-white hover:bg-red-700">
                {deleteShop.isPending ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}