import { useState } from "react";
import { useNavigate } from "react-router";
import { useShops } from "../../hooks/useShop";
import { Input } from "@/components/ui/input";
import { Store, Search, ChevronRight, MapPin } from "lucide-react";

export default function ShopsList() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const { data: shops = [], isLoading } = useShops({ search, limit: 100 });

  return (
    <section className="mx-auto max-w-[1420px] space-y-2.5">
      <div>
        <h1 className="text-[24px] font-bold tracking-tight text-[#101828]">Shops</h1>
        <p className="mt-0.5 text-[15px] text-[#667085]">All stores registered on the platform.</p>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5F7168]" />
        <Input value={search} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
          placeholder="Search shops..." className="h-10 pl-9" />
      </div>

      {/* List */}
      <div className="overflow-hidden rounded-xl border border-[#DDE7DF] bg-white shadow-sm">
        <div className="grid grid-cols-[1fr_1fr_120px_40px] gap-4 border-b border-[#DDE7DF] bg-[#F8FAF8] px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-[#667085]">
          <span>Shop</span>
          <span>Address</span>
          <span>Status</span>
          <span></span>
        </div>

        {isLoading ? (
          <p className="px-4 py-8 text-center text-sm text-[#667085]">Loading shops...</p>
        ) : shops.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-[#667085]">No shops found.</p>
        ) : (
          shops.map((shop) => (
            <button key={shop.id} type="button"
              onClick={() => navigate(`/app/shops/${shop.id}`)}
              className="grid w-full grid-cols-[1fr_1fr_120px_40px] items-center gap-4 border-b border-[#F3F4F6] px-4 py-3 text-left transition hover:bg-[#F8FAF8]">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[#EAF7EE] text-[#2D6A4F]">
                  {shop.logo_url ? (
                    <img src={shop.logo_url} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <Store className="h-4 w-4" />
                  )}
                </div>
                <span className="text-sm font-semibold text-[#101828]">{shop.shop_name}</span>
              </div>
              <span className="flex items-center gap-1 truncate text-sm text-[#5F7168]">
                {shop.address ? (<><MapPin className="h-3.5 w-3.5 shrink-0" /> {shop.address}</>) : "—"}
              </span>
              <span>
                <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                  shop.is_active ? "bg-[#EAF7EE] text-[#16A34A]" : "bg-[#FEE2E2] text-[#DC2626]"
                }`}>
                  {shop.is_active ? "Active" : "Inactive"}
                </span>
              </span>
              <ChevronRight className="h-4 w-4 text-[#98A2B3]" />
            </button>
          ))
        )}
      </div>
    </section>
  );
}