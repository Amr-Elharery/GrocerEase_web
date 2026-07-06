import { useState, type ElementType } from "react";
import { useTranslation } from "react-i18next";
import type { TFunction } from "i18next";
import { DollarSign, ShoppingCart, CalendarDays, TrendingUp, Store, Truck, ChevronLeft, ChevronRight } from "lucide-react";
import { useAdminDashboard } from "../hooks/useAnalytics";
import type {
  TopShop,
  TopProduct,
  OrdersByArea,
  ShopsByArea,
} from "../api/analyticsService";

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
        <linearGradient id="adminRevFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#16A34A" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#16A34A" stopOpacity="0.02" />
        </linearGradient>
      </defs>
      {yTicks.map((t, i) => {
        const y = padT + innerH - t * innerH;
        return (
          <g key={i}>
            <line x1={padL} x2={padL + innerW} y1={y} y2={y} stroke="#EAECF0" strokeWidth="1" />
            <text x={padL - 8} y={y + 3} textAnchor="end" className="fill-[#98A2B3]" fontSize="10">
              {Math.round(max * t)}
            </text>
          </g>
        );
      })}
      <polygon points={area} fill="url(#adminRevFill)" />
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
    return { color, dash: frac * circ, gap: circ - frac * circ, rotation: prev * 360 };
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

export default function AdminAnalyticsDashboard() {
  const { t } = useTranslation("analytics");
  const { data, isLoading } = useAdminDashboard();

  if (isLoading) {
    return (
      <div className="flex min-h-[calc(100vh-80px)] items-center justify-center">
        <p className="text-sm text-muted-foreground">{t("shared.loading")}</p>
      </div>
    );
  }

  const overview = data?.platform_overview ?? {
    total_orders: 0,
    total_revenue: 0,
    orders_this_month: 0,
    revenue_this_month: 0,
  };
  const byStatus = data?.orders_by_status ?? [];
  const totalOrders = byStatus.reduce((s, d) => s + (d.total ?? 0), 0);
  const daily = [...(data?.daily_orders ?? [])].sort(
    (a, b) => new Date(a.day).getTime() - new Date(b.day).getTime()
  );
  const topShops = data?.top_shops ?? [];
  const topProducts = data?.top_products ?? [];
  const ordersByArea = data?.orders_by_area ?? [];
  const delivery = data?.delivery_stats ?? { active_drivers: 0, total_deliveries: 0, avg_orders_per_driver: 0 };
  const shopsByArea = data?.shops_by_area ?? [];

  const revValues = daily.map((d) => d.revenue ?? 0);
  const revLabels = daily.map((d) =>
    new Date(d.day).toLocaleDateString("en-US", { month: "short", day: "numeric" })
  );

  return (
    <section className="mx-auto max-w-[1420px] space-y-4">
      {/* Header */}
      <div>
        <h1 className="text-[30px] font-bold tracking-tight text-[#101828]">{t("admin.title")}</h1>
        <p className="mt-1 text-sm text-[#667085]">{t("admin.subtitle")}</p>
      </div>

      {/* ---- */}

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title={t("shared.metrics.totalRevenue")}
          value={`EGP ${overview.total_revenue.toFixed(2)}`}
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
          title={t("admin.metrics.revenueThisMonth")}
          value={`EGP ${overview.revenue_this_month.toFixed(2)}`}
          icon={TrendingUp}
          tone="bg-[#F3E8FF] text-[#7E22CE]"
        />
        <MetricCard
          title={t("admin.metrics.ordersThisMonth")}
          value={String(overview.orders_this_month)}
          icon={CalendarDays}
          tone="bg-[#FFF4D8] text-[#D97706]"
        />
      </div>

      {/* Delivery stats  */}
      <div className="grid gap-3 sm:grid-cols-3">
        <MetricCard
          title={t("admin.metrics.activeDrivers")}
          value={String(delivery.active_drivers)}
          icon={Truck}
          tone="bg-[#EAF1FF] text-[#2563EB]"
        />
        <MetricCard
          title={t("admin.metrics.totalDeliveries")}
          value={String(delivery.total_deliveries)}
          icon={ShoppingCart}
          tone="bg-[#EAF7EE] text-[#16A34A]"
        />
        <MetricCard
          title={t("admin.metrics.avgOrdersPerDriver")}
          value={delivery.avg_orders_per_driver.toFixed(1)}
          icon={TrendingUp}
          tone="bg-[#F3E8FF] text-[#7E22CE]"
        />
      </div>

      {/* ---- CHARTS TOGETHER ---- */}
      <div className="grid gap-4 lg:grid-cols-3">
        <SectionCard className="lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-[#101828]">{t("shared.revenueOverview.title")}</h2>
              <p className="text-[22px] font-bold text-[#101828]">EGP {overview.total_revenue.toFixed(2)}</p>
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

      {/*  */}
      <div className="grid gap-4 lg:grid-cols-2 lg:items-stretch">
        <TableCard title={t("admin.topShops.title")} icon={Store} empty={t("admin.topShops.empty")} rows={topShops}
          head={[t("shared.tableHeaders.shop"), t("shared.tableHeaders.orders"), t("shared.tableHeaders.revenue")]}
          render={(s: TopShop) => (
            <tr key={s.shop_id} className="hover:bg-[#F9FAFB]">
              <td className="px-5 py-3 text-sm font-medium text-[#101828]">{s.shop_name}</td>
              <td className="px-5 py-3 text-sm text-[#667085]">{s.total_orders}</td>
              <td className="px-5 py-3 text-sm font-semibold text-[#101828]">EGP {(s.total_revenue ?? 0).toFixed(2)}</td>
            </tr>
          )}
        />
        <TableCard title={t("admin.topProducts.title")} icon={TrendingUp} empty={t("admin.topProducts.empty")} rows={topProducts}
          head={[t("shared.tableHeaders.product"), t("shared.tableHeaders.sold"), t("shared.tableHeaders.revenue")]}
          render={(p: TopProduct) => (
            <tr key={p.product_id} className="hover:bg-[#F9FAFB]">
              <td className="px-5 py-3 text-sm font-medium text-[#101828]">{p.product_name}</td>
              <td className="px-5 py-3 text-sm text-[#667085]">{p.total_sold}</td>
              <td className="px-5 py-3 text-sm font-semibold text-[#101828]">EGP {(p.total_revenue ?? 0).toFixed(2)}</td>
            </tr>
          )}
        />
        <TableCard title={t("admin.ordersByArea.title")} icon={ShoppingCart} empty={t("admin.ordersByArea.empty")} rows={ordersByArea}
          head={[t("shared.tableHeaders.area"), t("shared.tableHeaders.orders"), t("shared.tableHeaders.revenue")]}
          render={(a: OrdersByArea) => (
            <tr key={a.area_id} className="hover:bg-[#F9FAFB]">
              <td className="px-5 py-3 text-sm font-medium text-[#101828]">
                {a.area_name} <span className="text-[#98A2B3]">— {a.city_name}</span>
              </td>
              <td className="px-5 py-3 text-sm text-[#667085]">{a.total_orders}</td>
              <td className="px-5 py-3 text-sm font-semibold text-[#101828]">EGP {(a.total_revenue ?? 0).toFixed(2)}</td>
            </tr>
          )}
        />
        <TableCard title={t("admin.shopsByArea.title")} icon={Store} empty={t("admin.shopsByArea.empty")} rows={shopsByArea}
          pageSize={5}
          head={[t("shared.tableHeaders.area"), t("shared.tableHeaders.shops"), t("shared.tableHeaders.active")]}
          render={(a: ShopsByArea) => (
            <tr key={a.area_id} className="hover:bg-[#F9FAFB]">
              <td className="px-5 py-3 text-sm font-medium text-[#101828]">
                {a.area_name} <span className="text-[#98A2B3]">— {a.city_name}</span>
              </td>
              <td className="px-5 py-3 text-sm text-[#667085]">{a.total_shops}</td>
              <td className="px-5 py-3 text-sm font-semibold text-[#16A34A]">{a.active_shops}</td>
            </tr>
          )}
        />
      </div>
    </section>
  );
}

function TableCard<T>({
  title,
  icon: Icon,
  empty,
  rows,
  head,
  render,
  pageSize,
}: {
  title: string;
  icon: ElementType;
  empty: string;
  rows: T[];
  head: string[];
  render: (row: T) => React.ReactNode;
  pageSize?: number;
}) {
  const safeRows = Array.isArray(rows) ? rows : [];
  const [page, setPage] = useState(1);

  const paginated = typeof pageSize === "number" && pageSize > 0;
  const totalPages = paginated ? Math.max(1, Math.ceil(safeRows.length / pageSize!)) : 1;
  const currentPage = Math.min(page, totalPages);
  const visibleRows = paginated
    ? safeRows.slice((currentPage - 1) * pageSize!, currentPage * pageSize!)
    : safeRows;

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-[#E7EBF0] bg-white shadow-[0_2px_10px_rgba(15,23,42,0.04)]">
      <div className="flex items-center gap-2 border-b border-[#E7EBF0] px-5 py-3.5">
        <Icon className="h-4 w-4 text-[#667085]" />
        <h2 className="text-sm font-semibold text-[#101828]">{title}</h2>
      </div>
      {safeRows.length === 0 ? (
        <p className="px-5 py-6 text-sm text-[#98A2B3]">{empty}</p>
      ) : (
        <>
          <table className="w-full text-start">
            <thead>
              <tr className="border-b border-[#E7EBF0] bg-[#F9FAFB] text-[11px] font-semibold uppercase tracking-wide text-[#667085]">
                {head.map((h) => (
                  <th key={h} className="px-5 py-2.5 text-start">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F3F5]">{visibleRows.map(render)}</tbody>
          </table>

          {paginated && totalPages > 1 && (
            <div className="mt-auto flex items-center justify-between border-t border-[#E7EBF0] px-5 py-2.5">
              <span className="text-xs text-[#98A2B3]">
                {currentPage} / {totalPages}
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage <= 1}
                  className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#E7EBF0] text-[#5F7168] transition hover:bg-[#F8FAF8] disabled:opacity-40"
                >
                  <ChevronLeft className="h-4 w-4 rtl:-scale-x-100" />
                </button>
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage >= totalPages}
                  className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#E7EBF0] text-[#5F7168] transition hover:bg-[#F8FAF8] disabled:opacity-40"
                >
                  <ChevronRight className="h-4 w-4 rtl:-scale-x-100" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}