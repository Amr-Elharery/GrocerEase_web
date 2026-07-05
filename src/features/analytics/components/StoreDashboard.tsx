import type { ElementType } from "react";
import { useTranslation } from "react-i18next";
import type { TFunction } from "i18next";
import { DollarSign, ShoppingCart, Users, UserCheck, AlertTriangle, Package } from "lucide-react";
import { useShopDashboard } from "../hooks/useAnalytics";
import { useStoreOrders } from "@/features/orders/hooks/useStoreOrders";

const STATUS_BADGE: Record<string, string> = {
  pending: "border border-[#FCD34D] bg-[#FFF4D8] text-[#D97706]",
  processing: "border border-[#BFDBFE] bg-[#EAF1FF] text-[#2563EB]",
  assigned: "border border-[#BFDBFE] bg-[#EAF1FF] text-[#2563EB]",
  out_for_delivery: "border border-[#DDD6FE] bg-[#F3E8FF] text-[#7E22CE]",
  picked_up: "border border-[#A7F3D0] bg-[#ECFDF5] text-[#059669]",
  delivered: "border border-[#BBF7D0] bg-[#EAF7EE] text-[#16A34A]",
  cancelled: "border border-[#FECACA] bg-[#FEE2E2] text-[#DC2626]",
};

const STATUS_PALETTE: Record<string, string> = {
  pending: "#D97706",
  processing: "#2563EB",
  assigned: "#2563EB",
  out_for_delivery: "#7E22CE",
  picked_up: "#059669",
  delivered: "#16A34A",
  cancelled: "#DC2626",
};
const FALLBACK_COLORS = ["#16A34A", "#2563EB", "#D97706", "#7E22CE", "#DC2626", "#0EA5E9", "#F97316"];

const STATUS_LABEL_KEYS: Record<string, string> = {
  pending: "pending",
  processing: "processing",
  assigned: "assigned",
  out_for_delivery: "outForDelivery",
  picked_up: "pickedUp",
  delivered: "delivered",
  cancelled: "cancelled",
};

function formatStatus(t: TFunction, s: string) {
  const key = STATUS_LABEL_KEYS[s];
  return key ? t(`analytics:shared.statusLabels.${key}`) : s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

/* ---------- Cards ---------- */
function SectionCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-xl border border-[#E7EBF0] bg-white p-4 shadow-[0_2px_10px_rgba(15,23,42,0.04)] ${className}`}>
      {children}
    </div>
  );
}

function MetricCard({
  title,
  value,
  icon: Icon,
  tone,
}: {
  title: string;
  value: string;
  icon: ElementType;
  tone: string;
}) {
  return (
    <SectionCard className="p-3">
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0">
          <p className="text-xs font-medium text-[#667085]">{title}</p>
          <h3 className="mt-1 text-lg font-bold tracking-tight text-[#101828]">{value}</h3>
        </div>
        <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${tone}`}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
    </SectionCard>
  );
}

/* ---------- Area/Line chart ---------- */
function RevenueChart({ values, labels }: { values: number[]; labels: string[] }) {
  const width = 560;
  const height = 200;
  const padL = 44;
  const padR = 12;
  const padT = 14;
  const padB = 28;
  const innerW = width - padL - padR;
  const innerH = height - padT - padB;
  const max = Math.max(1, ...values);
  const stepX = values.length > 1 ? innerW / (values.length - 1) : 0;

  const pts = values.map((v, i) => {
    const x = padL + (values.length > 1 ? i * stepX : innerW / 2);
    const y = padT + innerH - (v / max) * innerH;
    return { x, y };
  });
  const line = pts.map((p) => `${p.x},${p.y}`).join(" ");
  const area = [`${padL},${padT + innerH}`, ...pts.map((p) => `${p.x},${p.y}`), `${padL + innerW},${padT + innerH}`].join(" ");

  const yTicks = [0, 0.5, 1];

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-[200px] w-full">
      <defs>
        <linearGradient id="revFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#16A34A" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#16A34A" stopOpacity="0.02" />
        </linearGradient>
      </defs>

      {yTicks.map((t, i) => {
        const y = padT + innerH - t * innerH;
        const val = Math.round(max * t);
        return (
          <g key={i}>
            <line x1={padL} x2={padL + innerW} y1={y} y2={y} stroke="#EAECF0" strokeWidth="1" />
            <text x={padL - 8} y={y + 3} textAnchor="end" className="fill-[#98A2B3]" fontSize="10">
              {val}
            </text>
          </g>
        );
      })}

      <polygon points={area} fill="url(#revFill)" />
      <polyline points={line} fill="none" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {pts.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="3.5" fill="#fff" stroke="#16A34A" strokeWidth="2" />
      ))}

      {labels.map((lb, i) => {
        const x = padL + (values.length > 1 ? i * stepX : innerW / 2);
        return (
          <text key={i} x={x} y={height - 8} textAnchor="middle" className="fill-[#98A2B3]" fontSize="10">
            {lb}
          </text>
        );
      })}
    </svg>
  );
}

/* ---------- Donut ---------- */
function StatusDonut({ data, t }: { data: { status: string; total: number }[]; t: TFunction }) {
  const total = data.reduce((s, d) => s + d.total, 0);
  const size = 168;
  const stroke = 26;
  const r = (size - stroke) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const circ = 2 * Math.PI * r;

  const fractions = data.map((d) => (total > 0 ? d.total / total : 0));
  const segments = data.map((d, i) => {
    const frac = fractions[i];
    const color = STATUS_PALETTE[d.status] ?? FALLBACK_COLORS[i % FALLBACK_COLORS.length];
    const prev = fractions.slice(0, i).reduce((a, b) => a + b, 0);
    return {
      color,
      dash: frac * circ,
      gap: circ - frac * circ,
      rotation: prev * 360,
    };
  });

  return (
    <div className="flex items-center gap-5">
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="#F1F3F5" strokeWidth={stroke} />
          {segments.map((s, i) => (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r={r}
              fill="none"
              stroke={s.color}
              strokeWidth={stroke}
              strokeDasharray={`${s.dash} ${s.gap}`}
              strokeDashoffset={-(s.rotation / 360) * circ}
            />
          ))}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-[#101828]">{total}</span>
          <span className="text-[11px] text-[#667085]">{t("analytics:shared.ordersByStatus.centerLabel")}</span>
        </div>
      </div>

      <div className="min-w-0 flex-1 space-y-2">
        {data.map((d, i) => (
          <div key={d.status} className="flex items-center justify-between gap-2">
            <span className="flex min-w-0 items-center gap-2">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ background: STATUS_PALETTE[d.status] ?? FALLBACK_COLORS[i % FALLBACK_COLORS.length] }}
              />
              <span className="truncate text-sm text-[#475467]">{formatStatus(t, d.status)}</span>
            </span>
            <span className="text-sm font-semibold text-[#101828]">{d.total}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- Page ---------- */
export default function StoreDashboard() {
  const { t } = useTranslation("analytics");
  const { data, isLoading } = useShopDashboard();
  const { data: recentOrders = [] } = useStoreOrders(1);

  if (isLoading) {
    return (
      <div className="flex min-h-[calc(100vh-80px)] items-center justify-center">
        <p className="text-sm text-muted-foreground">{t("shared.loading")}</p>
      </div>
    );
  }

  const daily = [...(data?.daily_revenue ?? [])].sort(
    (a, b) => new Date(a.day).getTime() - new Date(b.day).getTime()
  );
  const byStatus = data?.orders_by_status ?? [];
  const bestSelling = data?.best_selling_products ?? [];
  const lowStock = data?.low_stock_products ?? [];
  const customers = data?.customer_stats ?? { unique_customers: 0, repeat_customers: 0 };

  const totalRevenue = daily.reduce((s, d) => s + (d.revenue ?? 0), 0);
  const totalOrders = byStatus.reduce((s, d) => s + (d.total ?? 0), 0);
  const totalSold = bestSelling.reduce((s, p) => s + (p.total_sold ?? 0), 0);

  const revValues = daily.map((d) => d.revenue ?? 0);
  const revLabels = daily.map((d) =>
    new Date(d.day).toLocaleDateString("en-US", { month: "short", day: "numeric" })
  );

  return (
    <section className="mx-auto max-w-[1420px] space-y-4">
      {/* Header */}
      <div>
        <h1 className="text-[30px] font-bold tracking-tight text-[#101828]">{t("store.title")}</h1>
        <p className="mt-1 text-sm text-[#667085]">{t("store.subtitle")}</p>
      </div>

      {/* Metric cards */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <MetricCard
          title={t("shared.metrics.totalRevenue")}
          value={`EGP ${totalRevenue.toFixed(2)}`}
          icon={DollarSign}
          tone="bg-[#EAF7EE] text-[#16A34A]"
        />
        <MetricCard
          title={t("shared.metrics.totalOrders")}
          value={String(totalOrders)}
          icon={ShoppingCart}
          tone="bg-[#EAF1FF] text-[#2563EB]"
        />
        <MetricCard
          title={t("store.metrics.uniqueCustomers")}
          value={String(customers.unique_customers)}
          icon={Users}
          tone="bg-[#F3E8FF] text-[#7E22CE]"
        />
        <MetricCard
          title={t("store.metrics.repeatCustomers")}
          value={String(customers.repeat_customers)}
          icon={UserCheck}
          tone="bg-[#EAF7EE] text-[#16A34A]"
        />
        <MetricCard
          title={t("store.metrics.lowStock")}
          value={String(lowStock.length)}
          icon={AlertTriangle}
          tone="bg-[#FFF4D8] text-[#D97706]"
        />
      </div>

      {/* Charts row */}
      <div className="grid gap-4 lg:grid-cols-3">
        <SectionCard className="lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-[#101828]">{t("shared.revenueOverview.title")}</h2>
              <p className="text-[22px] font-bold text-[#101828]">EGP {totalRevenue.toFixed(2)}</p>
            </div>
            <span className="rounded-lg border border-[#E7EBF0] px-2.5 py-1 text-xs text-[#667085]">
              {t("shared.revenueOverview.lastDays", { count: daily.length })}
            </span>
          </div>
          {daily.length === 0 ? (
            <p className="mt-8 text-sm text-[#98A2B3]">{t("shared.revenueOverview.empty")}</p>
          ) : (
            <div className="mt-3">
              <RevenueChart values={revValues} labels={revLabels} />
            </div>
          )}
        </SectionCard>

        <SectionCard>
          <h2 className="text-sm font-semibold text-[#101828]">{t("shared.ordersByStatus.title")}</h2>
          {byStatus.length === 0 ? (
            <p className="mt-8 text-sm text-[#98A2B3]">{t("shared.ordersByStatus.empty")}</p>
          ) : (
            <div className="mt-4">
              <StatusDonut data={byStatus} t={t} />
            </div>
          )}
        </SectionCard>
      </div>

      {/* Tables row */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Best selling */}
        <div className="overflow-hidden rounded-xl border border-[#E7EBF0] bg-white shadow-[0_2px_10px_rgba(15,23,42,0.04)]">
          <div className="flex items-center justify-between border-b border-[#E7EBF0] px-5 py-3.5">
            <h2 className="text-sm font-semibold text-[#101828]">{t("store.bestSelling.title")}</h2>
            <span className="rounded-full bg-[#EAF7EE] px-2.5 py-1 text-[11px] font-semibold text-[#16A34A]">
              {t("store.bestSelling.soldBadge", { count: totalSold })}
            </span>
          </div>
          {bestSelling.length === 0 ? (
            <p className="px-5 py-6 text-sm text-[#98A2B3]">{t("store.bestSelling.empty")}</p>
          ) : (
            <table className="w-full text-start">
              <thead>
                <tr className="border-b border-[#E7EBF0] bg-[#F9FAFB] text-[11px] font-semibold uppercase tracking-wide text-[#667085]">
                  <th className="px-5 py-2.5">{t("shared.tableHeaders.product")}</th>
                  <th className="px-5 py-2.5">{t("shared.tableHeaders.sold")}</th>
                  <th className="px-5 py-2.5">{t("shared.tableHeaders.revenue")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F3F5]">
                {bestSelling.map((p) => (
                  <tr key={p.shop_product_id} className="hover:bg-[#F9FAFB]">
                    <td className="px-5 py-3 text-sm font-medium text-[#101828]">{p.product_name}</td>
                    <td className="px-5 py-3 text-sm text-[#667085]">{p.total_sold}</td>
                    <td className="px-5 py-3 text-sm font-semibold text-[#101828]">
                      EGP {(p.total_revenue ?? 0).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Low stock */}
        <div className="overflow-hidden rounded-xl border border-[#E7EBF0] bg-white shadow-[0_2px_10px_rgba(15,23,42,0.04)]">
          <div className="flex items-center gap-2 border-b border-[#E7EBF0] px-5 py-3.5">
            <Package className="h-4 w-4 text-[#D97706]" />
            <h2 className="text-sm font-semibold text-[#101828]">{t("store.lowStock.title")}</h2>
          </div>
          {lowStock.length === 0 ? (
            <p className="px-5 py-6 text-sm text-[#98A2B3]">{t("store.lowStock.empty")}</p>
          ) : (
            <table className="w-full text-start">
              <thead>
                <tr className="border-b border-[#E7EBF0] bg-[#F9FAFB] text-[11px] font-semibold uppercase tracking-wide text-[#667085]">
                  <th className="px-5 py-2.5">{t("shared.tableHeaders.product")}</th>
                  <th className="px-5 py-2.5">{t("shared.tableHeaders.available")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F3F5]">
                {lowStock.map((p) => (
                  <tr key={p.shop_product_id} className="hover:bg-[#F9FAFB]">
                    <td className="px-5 py-3 text-sm font-medium text-[#101828]">{p.product_name}</td>
                    <td className="px-5 py-3">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-[11px] font-bold ${
                          p.available_stock === 0
                            ? "border border-[#FECACA] bg-[#FEE2E2] text-[#DC2626]"
                            : "border border-[#FCD34D] bg-[#FFF4D8] text-[#D97706]"
                        }`}
                      >
                        {t("store.lowStock.leftBadge", { count: p.available_stock })}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
      {/* Recent Orders */}
      <div className="overflow-hidden rounded-xl border border-[#E7EBF0] bg-white shadow-[0_2px_10px_rgba(15,23,42,0.04)]">
        <div className="border-b border-[#E7EBF0] px-5 py-3.5">
          <h2 className="text-sm font-semibold text-[#101828]">{t("store.recentOrders.title")}</h2>
        </div>
        {recentOrders.length === 0 ? (
          <p className="px-5 py-6 text-sm text-[#98A2B3]">{t("store.recentOrders.empty")}</p>
        ) : (
          <table className="w-full text-start">
            <thead>
              <tr className="border-b border-[#E7EBF0] bg-[#F9FAFB] text-[11px] font-semibold uppercase tracking-wide text-[#667085]">
                <th className="px-5 py-2.5">{t("shared.tableHeaders.orderId")}</th>
                <th className="px-5 py-2.5">{t("shared.tableHeaders.customer")}</th>
                <th className="px-5 py-2.5">{t("shared.tableHeaders.items")}</th>
                <th className="px-5 py-2.5">{t("shared.tableHeaders.total")}</th>
                <th className="px-5 py-2.5">{t("shared.tableHeaders.status")}</th>
                <th className="px-5 py-2.5">{t("shared.tableHeaders.date")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F3F5]">
              {recentOrders.slice(0, 5).map((o) => (
                <tr key={o.id} className="hover:bg-[#F9FAFB]">
                  <td className="px-5 py-3 font-mono text-xs text-[#667085]">#{o.order_id}</td>
                  <td className="px-5 py-3 text-sm font-medium text-[#101828]">
                    <span className="block max-w-[160px] truncate">{o.customer_name}</span>
                  </td>
                  <td className="px-5 py-3 text-sm text-[#667085]">{o.items_count}</td>
                  <td className="px-5 py-3 text-sm font-semibold text-[#101828]">
                    EGP {o.total.toFixed(2)}
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide ${
                        STATUS_BADGE[o.status] ?? "border border-[#E5E7EB] bg-[#F3F4F6] text-[#667085]"
                      }`}
                    >
                      {formatStatus(t, o.status)}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-xs text-[#667085]">
                    {new Date(o.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}