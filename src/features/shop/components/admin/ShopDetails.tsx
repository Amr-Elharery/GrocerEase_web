import { useParams, useNavigate } from "react-router";
import { useShop } from "../../hooks/useShop";
import { Button } from "@/components/ui/button";
import { Store, ArrowLeft } from "lucide-react";

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <p className="text-xs font-semibold text-[#667085]">{label}</p>
      <div className="flex min-h-10 items-center rounded-lg border border-[#DFE7E1] bg-[#F8FAF8] px-3 py-2 text-sm text-[#101828]">
        {value || <span className="text-[#98A2B3]">—</span>}
      </div>
    </div>
  );
}

export default function ShopDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: shop, isLoading, isError } = useShop(id ? Number(id) : undefined);

  if (isLoading) {
    return (
      <section className="flex min-h-[300px] items-center justify-center">
        <p className="text-sm text-[#667085]">Loading shop...</p>
      </section>
    );
  }

  if (isError || !shop) {
    return (
      <section className="mx-auto max-w-2xl">
        <Button type="button" variant="outline" onClick={() => navigate("/app/shops")}
          className="mb-4 h-9 gap-2 text-sm font-semibold">
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
        <p className="rounded-xl border border-[#DDE7DF] bg-white p-6 text-center text-sm text-[#667085]">
          Shop not found.
        </p>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-2xl space-y-4">
      <Button type="button" variant="outline" onClick={() => navigate("/app/shops")}
        className="h-9 gap-2 text-sm font-semibold">
        <ArrowLeft className="h-4 w-4" /> Back to Shops
      </Button>

      <div className="rounded-2xl border border-[#DDE7DF] bg-white p-5 shadow-sm">
        {/* Header */}
        <div className="mb-5 flex items-center gap-3 border-b border-[#EEF2EF] pb-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#EAF7EE] text-[#2D6A4F]">
            {shop.logo_url ? (
              <img src={shop.logo_url} alt="" className="h-full w-full object-cover" />
            ) : (
              <Store className="h-6 w-6" />
            )}
          </div>
          <div>
            <h1 className="text-xl font-black text-[#101828]">{shop.shop_name}</h1>
            <span className={`mt-1 inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
              shop.is_active ? "bg-[#EAF7EE] text-[#16A34A]" : "bg-[#FEE2E2] text-[#DC2626]"
            }`}>
              {shop.is_active ? "Active" : "Inactive"}
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <Row label="Description" value={shop.description ?? ""} />
          <Row label="Address" value={shop.address ?? ""} />
          <div className="grid gap-4 md:grid-cols-2">
            <Row label="Phone Number" value={shop.phone_number ?? ""} />
            <Row label="Area ID" value={shop.area_id != null ? String(shop.area_id) : ""} />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Row label="Latitude" value={shop.latitude != null ? String(shop.latitude) : ""} />
            <Row label="Longitude" value={shop.longitude != null ? String(shop.longitude) : ""} />
          </div>
          <Row label="Owner ID" value={shop.owner_id ?? ""} />
        </div>
      </div>
    </section>
  );
}