import { useTranslation } from "react-i18next";
import { useMyShop } from "../hooks/useShop";
import { useMyRequests } from "../hooks/useSubmissionRequest";
import { ClipboardList, Package } from "lucide-react";

function StatusBadge({ status }: { status: string }) {
  const { t } = useTranslation(["shop"]);
  const s = (status ?? "").toLowerCase();
  const styles =
    s === "approved" ? "bg-green-50 text-green-700 border-green-200"
    : s === "rejected" ? "bg-red-50 text-red-600 border-red-200"
    : "bg-yellow-50 text-yellow-700 border-yellow-200";
  const label = s === "approved"
    ? t("shop:myRequests.statuses.approved")
    : s === "rejected"
    ? t("shop:myRequests.statuses.rejected")
    : t("shop:myRequests.statuses.pending");
  return (
    <span className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-semibold ${styles}`}>
      {label}
    </span>
  );
}

export default function MyRequests() {
  const { t } = useTranslation(["shop"]);
  const { data: myShop } = useMyShop();
  const { data: requests = [], isLoading } = useMyRequests(myShop?.id);

  return (
    <section className="mx-auto max-w-3xl space-y-4">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#1B4332] text-white">
          <ClipboardList className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-xl font-black text-[#101828]">{t("shop:myRequests.title")}</h1>
          <p className="text-sm text-[#667085]">{t("shop:myRequests.subtitle")}</p>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#DDE7DF] bg-white shadow-sm">
        {isLoading ? (
          <p className="px-4 py-10 text-center text-sm text-[#667085]">{t("shop:myRequests.loading")}</p>
        ) : requests.length === 0 ? (
          <div className="flex flex-col items-center gap-2 px-4 py-12 text-center">
            <Package className="h-8 w-8 text-[#C9D8CE]" />
            <p className="text-sm text-[#667085]">{t("shop:myRequests.emptyTitle")}</p>
            <p className="text-xs text-[#98A2B3]">{t("shop:myRequests.emptyHint")}</p>
          </div>
        ) : (
          <div className="divide-y divide-[#EEF2EF]">
            {requests.map((req) => (
              <div key={req.id} className="flex items-center gap-3 px-4 py-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[#EAF7EE] text-[#2D6A4F]">
                  {req.image_url ? (
                    <img src={req.image_url} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <Package className="h-4 w-4" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-[#101828]">{req.name}</p>
                  <p className="truncate text-xs text-[#667085]">
                    {req.brand ? `${req.brand} · ` : ""}{new Date(req.created_at).toLocaleDateString()}
                  </p>
                </div>
                <StatusBadge status={req.status} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}