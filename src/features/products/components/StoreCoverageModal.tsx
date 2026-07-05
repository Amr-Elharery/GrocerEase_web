import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { productService } from "../api/productService";
import { X, Store, Package, Tag, Layers, Box } from "lucide-react";

export default function StoreCoverageModal({
  productId,
  productName,
  onClose,
}: {
  productId: number;
  productName: string;
  onClose: () => void;
}) {
  const { t } = useTranslation("products");
  const { data: product, isLoading } = useQuery({
    queryKey: ["product", productId],
    queryFn: () => productService.getProduct(String(productId)),
  });

  const shops = product?.shops ?? [];
  const images = product?.product_images ?? [];
  const primaryImg = images.find((i) => i.is_primary) ?? images[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6" onClick={onClose}>
      <div className="flex max-h-[75vh] w-full max-w-md flex-col overflow-hidden rounded-2xl bg-white shadow-xl" onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className="flex shrink-0 items-start justify-between border-b border-[#EEF2EF] px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#EAF7EE] text-[#006B22]">
              {primaryImg?.image_url ? (
                <img src={primaryImg.image_url} alt="" className="h-full w-full object-cover" />
              ) : (
                <Package className="h-5 w-5" />
              )}
            </div>
            <div>
              <h3 className="text-base font-bold text-[#101828]">{product?.product_name ?? productName}</h3>
              <p className="text-xs text-[#667085]">{product?.brand || t("coverage.productDetailsFallback")}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-[#98A2B3] transition hover:text-[#101828]">
            <X className="h-5 w-5" />
          </button>
        </div>

        {isLoading ? (
          <p className="px-5 py-12 text-center text-sm text-[#667085]">{t("coverage.loading")}</p>
        ) : (
          <div className="flex-1 overflow-y-auto px-5 py-4">

            {/* Info grid */}
            <div className="grid grid-cols-2 gap-3">
              <InfoRow icon={<Tag className="h-3.5 w-3.5" />} label={t("coverage.category")} value={product?.category?.category_name ?? "—"} />
              <InfoRow icon={<Layers className="h-3.5 w-3.5" />} label={t("coverage.subCategory")} value={product?.sub_category?.category_name ?? "—"} />
              <InfoRow icon={<Box className="h-3.5 w-3.5" />} label={t("coverage.unitSize")} value={product?.unit ?? "—"} />
              <InfoRow icon={<Store className="h-3.5 w-3.5" />} label={t("coverage.brand")} value={product?.brand ?? "—"} />
            </div>

            {/* Description */}
            {product?.description && (
              <div className="mt-4">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-[#667085]">{t("coverage.description")}</p>
                <p className="mt-1 rounded-lg bg-[#F8FAF8] p-2.5 text-sm leading-5 text-[#475467]">{product.description}</p>
              </div>
            )}

            {/* Images */}
            {images.length > 0 && (
              <div className="mt-4">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-[#667085]">{t("coverage.images", { count: images.length })}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {images.map((img) => (
                    <div key={img.id} className="h-16 w-16 overflow-hidden rounded-lg border border-[#EEF2EF] bg-[#F8FAF8]">
                      {img.image_url && <img src={img.image_url} alt="" className="h-full w-full object-cover" />}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Store coverage */}
            <div className="mt-4">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-[#667085]">
                {t("coverage.storeCoverage", { count: shops.length })}
              </p>
              {shops.length === 0 ? (
                <div className="mt-2 flex flex-col items-center gap-2 rounded-xl bg-[#F8FAF8] py-8 text-center">
                  <Package className="h-7 w-7 text-[#C9D8CE]" />
                  <p className="text-sm text-[#667085]">{t("coverage.noStores")}</p>
                </div>
              ) : (
                <div className="mt-2 space-y-2">
                  {shops.map((s, i) => (
                    <div key={i} className="flex items-center gap-3 rounded-xl border border-[#EEF2EF] bg-[#F8FAF8] px-3 py-2.5">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white text-[#5F7168]">
                        {s.shop?.logo_url ? (
                          <img src={s.shop.logo_url} alt="" className="h-full w-full object-cover" />
                        ) : (
                          <Store className="h-4 w-4" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-[#101828]">{s.shop?.shop_name ?? "—"}</p>
                        <p className="text-xs text-[#667085]">
                          {t("coverage.stockPrice", { stock: s.available_stock ?? 0, price: (s.price ?? 0).toFixed(2) })}
                        </p>
                      </div>
                      <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                        s.is_active ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"
                      }`}>
                        {s.is_active ? t("coverage.active") : t("coverage.hidden")}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-lg bg-[#F8FAF8] px-3 py-2">
      <div className="flex items-center gap-1.5 text-[#667085]">
        {icon}
        <span className="text-[10px] font-semibold uppercase tracking-wide">{label}</span>
      </div>
      <p className="mt-0.5 truncate text-sm font-semibold text-[#101828]">{value}</p>
    </div>
  );
}