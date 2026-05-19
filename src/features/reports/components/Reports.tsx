import {
  ArrowUp,
  ArrowDown,
  Download,
  ChevronDown,
  TrendingUp,
  ShoppingBag,
  Package,
  Search,
  RotateCcw,
} from "lucide-react";
import {
  useReportSummary,
  useRevenueData,
  useTopProducts,
  useStorePerformance,
  useOrderStatus,
} from "../hooks/useReports";

function SectionCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`min-w-0 rounded-xl border border-[#DDE7DF] bg-white shadow-[0_2px_10px_rgba(15,23,42,0.04)] ${className}`}
    >
      {children}
    </div>
  );
}

function MiniSelect({ label }: { label: string }) {
  return (
    <button
      type="button"
      className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-lg border border-[#DDE7DF] bg-white px-3 text-xs font-semibold text-[#344054] transition hover:bg-[#F8FAF8]"
    >
      {label}
      <ChevronDown className="h-3.5 w-3.5" />
    </button>
  );
}

function AreaChart({
  values,
  max,
  lineColor = "#16A34A",
}: {
  values: number[];
  max: number;
  lineColor?: string;
}) {
  const width = 420;
  const height = 112;
  const px = 8;
  const py = 8;
  const iw = width - px * 2;
  const ih = height - py * 2;
  const stepX = values.length > 1 ? iw / (values.length - 1) : 0;

  const points = values.map((value, index) => {
    const x = px + index * stepX;
    const y = py + ih - (value / max) * ih;
    return `${x},${y}`;
  });

  const area = [
    `${px},${height - py}`,
    ...points,
    `${px + iw},${height - py}`,
  ].join(" ");

  const gradId = `grad-${lineColor.replace("#", "")}`;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-[112px] w-full">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={lineColor} stopOpacity="0.2" />
          <stop offset="100%" stopColor={lineColor} stopOpacity="0.02" />
        </linearGradient>
      </defs>

      {[0, 1, 2].map((item) => (
        <line
          key={item}
          x1={px}
          x2={width - px}
          y1={py + (ih / 2) * item}
          y2={py + (ih / 2) * item}
          stroke="#EAECF0"
          strokeWidth="1"
        />
      ))}

      <polygon points={area} fill={`url(#${gradId})`} />

      <polyline
        points={points.join(" ")}
        fill="none"
        stroke={lineColor}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Reports() {
  const { data: summary, isLoading: summaryLoading } = useReportSummary();
  const { data: revenueData = [] } = useRevenueData();
  const { data: topProducts = [] } = useTopProducts();
  const { data: storePerformance = [] } = useStorePerformance();
  const { data: orderStatus = [] } = useOrderStatus();

  if (summaryLoading) {
    return (
      <div className="flex min-h-[calc(100vh-80px)] items-center justify-center">
        <p className="text-sm text-[#667085]">Loading reports...</p>
      </div>
    );
  }

  const statCards = [
    {
      label: "Revenue",
      value: summary?.total_revenue ?? "-",
      change: `${summary?.revenue_growth}%`,
      trend: (summary?.revenue_growth ?? 0) > 0 ? "up" : "down",
      icon: TrendingUp,
      color: "bg-[#EAF7EE] text-[#16A34A]",
      note: "Gross revenue",
    },
    {
      label: "Orders",
      value: summary?.total_orders.toLocaleString() ?? "-",
      change: `${summary?.orders_growth}%`,
      trend: (summary?.orders_growth ?? 0) > 0 ? "up" : "down",
      icon: ShoppingBag,
      color: "bg-[#EAF7EE] text-[#16A34A]",
      note: "Completed and active",
    },
    {
      label: "Avg Order Value",
      value: summary?.avg_order_value ?? "-",
      change: `${Math.abs(summary?.avg_order_growth ?? 0)}%`,
      trend: (summary?.avg_order_growth ?? 0) > 0 ? "up" : "down",
      icon: Package,
      color: "bg-[#FFF4D8] text-[#D97706]",
      note: "Per customer order",
    },
  ];

  return (
    <section className="space-y-4">
      <div className="flex flex-col justify-between gap-3 lg:flex-row lg:items-end">
        <div>
          <h1 className="text-[24px] font-bold tracking-tight text-[#101828]">
            Reports & Analytics
          </h1>
          <p className="mt-1 text-[15px] text-[#667085]">
            Analyze revenue, order fulfillment, products, and store performance.
          </p>
        </div>

        <button
          type="button"
          className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#006B22] px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#00571C]"
        >
          <Download className="h-4 w-4" />
          Export Report
        </button>
      </div>

      <SectionCard className="p-4">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex min-w-[220px] items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#EAF7EE] text-[#006B22]">
              <Search className="h-4 w-4" />
            </div>

            <div>
              <p className="text-sm font-bold text-[#101828]">
                Report Controls
              </p>
              <p className="text-xs text-[#667085]">
                Filter analytics by period, store, and category.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-4">
            <button
              type="button"
              className="flex h-9 min-w-[150px] items-center justify-between rounded-lg border border-[#DDE7DF] bg-[#F8FAF8] px-3 text-sm font-medium text-[#101828]"
            >
              <span>May 2025</span>
              <ChevronDown className="h-4 w-4 text-[#5F7168]" />
            </button>

            <button
              type="button"
              className="flex h-9 min-w-[150px] items-center justify-between rounded-lg border border-[#DDE7DF] bg-[#F8FAF8] px-3 text-sm font-medium text-[#101828]"
            >
              <span>All Stores</span>
              <ChevronDown className="h-4 w-4 text-[#5F7168]" />
            </button>

            <button
              type="button"
              className="flex h-9 min-w-[150px] items-center justify-between rounded-lg border border-[#DDE7DF] bg-[#F8FAF8] px-3 text-sm font-medium text-[#101828]"
            >
              <span>All Categories</span>
              <ChevronDown className="h-4 w-4 text-[#5F7168]" />
            </button>

            <button
              type="button"
className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-[#DDE7DF] bg-white px-3 text-sm font-semibold text-[#5F7168] transition hover:bg-[#F8FAF8] hover:text-[#101828]"            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </button>
          </div>
        </div>
      </SectionCard>

      <div className="grid gap-3 md:grid-cols-3">
        {statCards.map((stat) => (
          <SectionCard key={stat.label} className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-[#667085]">
                  {stat.label}
                </p>
                <h3 className="mt-1.5 text-[24px] font-bold tracking-tight text-[#101828]">
                  {stat.value}
                </h3>
                <p className="mt-1 text-xs text-[#98A2B3]">{stat.note}</p>
              </div>

              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.color}`}
              >
                <stat.icon className="h-5 w-5" />
              </div>
            </div>

            <div className="mt-3 flex items-center gap-2 text-xs">
              <span
                className={`inline-flex items-center gap-1 font-semibold ${
                  stat.trend === "up" ? "text-[#16A34A]" : "text-[#F97316]"
                }`}
              >
                {stat.trend === "up" ? (
                  <ArrowUp className="h-3 w-3" />
                ) : (
                  <ArrowDown className="h-3 w-3" />
                )}
                {stat.change}
              </span>
              <span className="text-[#98A2B3]">vs last month</span>
            </div>
          </SectionCard>
        ))}
      </div>

      <div className="grid min-w-0 items-start gap-3 xl:grid-cols-[1.15fr_0.85fr]">
        <SectionCard className="p-4">
          <div className="mb-3 flex items-start justify-between gap-2">
            <div>
              <h3 className="text-[16px] font-bold text-[#101828]">
                Monthly Revenue Analysis
              </h3>
              <div className="mt-1.5 flex items-center gap-3">
                <span className="text-[20px] font-bold text-[#101828]">
                  {summary?.total_revenue}
                </span>
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-[#16A34A]">
                  <ArrowUp className="h-3.5 w-3.5" />{" "}
                  {summary?.revenue_growth}%
                </span>
              </div>
            </div>

            <MiniSelect label="Revenue" />
          </div>

          <div className="grid grid-cols-[34px_1fr] gap-2">
            <div className="flex h-[112px] flex-col justify-between pb-2 text-[10px] font-medium text-[#98A2B3]">
              <span>40k</span>
              <span>20k</span>
              <span>0</span>
            </div>

            <div>
              <AreaChart
                values={revenueData.map((item) => item.value)}
                max={40}
                lineColor="#16A34A"
              />

              <div
                className="mt-1 grid text-center text-[9px] font-medium text-[#98A2B3]"
                style={{
                  gridTemplateColumns: `repeat(${revenueData.length}, 1fr)`,
                }}
              >
                {revenueData.map((item) => (
                  <span key={item.month}>{item.month}</span>
                ))}
              </div>
            </div>
          </div>
        </SectionCard>

        <SectionCard className="p-4">
          <div className="mb-3 flex items-start justify-between gap-2">
            <div>
              <h3 className="text-[16px] font-bold text-[#101828]">
                Fulfillment Status Analysis
              </h3>
              <div className="mt-1.5 flex items-center gap-3">
                <span className="text-[20px] font-bold text-[#101828]">
                  {summary?.total_orders.toLocaleString()}
                </span>
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-[#16A34A]">
                  <ArrowUp className="h-3.5 w-3.5" />{" "}
                  {summary?.orders_growth}%
                </span>
              </div>
            </div>

            <MiniSelect label="Orders" />
          </div>

          <div className="mt-2 flex items-center gap-4">
            <div
              className="relative h-[106px] w-[106px] shrink-0 rounded-full"
              style={{
                background: `conic-gradient(${orderStatus
                  .map((status, index) => {
                    const previous = orderStatus
                      .slice(0, index)
                      .reduce((acc, current) => acc + current.percent, 0);

                    return `${status.color} ${previous}% ${
                      previous + status.percent
                    }%`;
                  })
                  .join(", ")})`,
              }}
            >
              <div className="absolute left-1/2 top-1/2 flex h-[64px] w-[64px] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full bg-white">
                <span className="text-[13px] font-bold text-[#101828]">
                  {summary?.total_orders.toLocaleString()}
                </span>
                <span className="text-[9px] text-[#667085]">Total</span>
              </div>
            </div>

            <div className="flex-1 space-y-2">
              {orderStatus.map((item) => (
                <div key={item.label} className="flex items-center gap-2 text-xs">
                  <span
                    className="h-2 w-2 shrink-0 rounded-full"
                    style={{ background: item.color }}
                  />
                  <span className="flex-1 truncate text-[#344054]">
                    {item.label}
                  </span>
                  <span className="font-semibold text-[#101828]">
                    {item.percent}%
                  </span>
                  <span className="text-[#667085]">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </SectionCard>
      </div>

      <div className="grid min-w-0 items-start gap-3 xl:grid-cols-[1.15fr_0.85fr]">
        <SectionCard className="p-4">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-[#101828]">
                Product Ranking by Sales Volume
              </h3>
              <p className="mt-0.5 text-xs text-[#667085]">
                Best-performing products ranked by sold units.
              </p>
            </div>

            <MiniSelect label="Top 5" />
          </div>

          <div className="space-y-3">
            {topProducts.map((product, index) => (
              <div key={product.name} className="flex items-center gap-3">
                <span className="w-5 shrink-0 text-center text-xs font-bold text-[#98A2B3]">
                  {index + 1}
                </span>

                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-[#101828]">
                        {product.name}
                      </p>
                      <p className="text-[10px] text-[#667085]">
                        {product.category}
                      </p>
                    </div>

                    <span
                      className={`shrink-0 text-xs font-semibold ${
                        product.growth > 0
                          ? "text-[#16A34A]"
                          : "text-[#DC2626]"
                      }`}
                    >
                      {product.growth > 0 ? "+" : ""}
                      {product.growth}%
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <div className="h-1.5 flex-1 rounded-full bg-[#F3F4F6]">
                      <div
                        className="h-1.5 rounded-full bg-[#16A34A]"
                        style={{
                          width: `${
                            (product.sales / (topProducts[0]?.sales ?? 1)) *
                            100
                          }%`,
                        }}
                      />
                    </div>

                    <span className="shrink-0 text-xs text-[#667085]">
                      {product.sales} sold
                    </span>
                  </div>
                </div>

                <span className="shrink-0 text-xs font-semibold text-[#344054]">
                  {product.revenue}
                </span>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard className="p-4">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-[#101828]">
                Store Revenue Contribution
              </h3>
              <p className="mt-0.5 text-xs text-[#667085]">
                Store contribution by orders and revenue.
              </p>
            </div>

            <MiniSelect label="Stores" />
          </div>

          <div className="space-y-3">
            {storePerformance.map((store, index) => (
              <div key={store.name} className="space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex min-w-0 items-center gap-2">
                    <span className="w-4 shrink-0 text-xs font-bold text-[#98A2B3]">
                      {index + 1}
                    </span>
                    <p className="truncate text-sm font-semibold text-[#101828]">
                      {store.name}
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    <span
                      className={`text-xs font-semibold ${
                        store.growth > 0 ? "text-[#16A34A]" : "text-[#DC2626]"
                      }`}
                    >
                      {store.growth > 0 ? "+" : ""}
                      {store.growth}%
                    </span>
                    <span className="text-xs font-semibold text-[#344054]">
                      {store.revenue}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="h-1.5 flex-1 rounded-full bg-[#F3F4F6]">
                    <div
                      className="h-1.5 rounded-full bg-[#16A34A]"
                      style={{ width: `${store.percent}%` }}
                    />
                  </div>

                  <span className="shrink-0 text-xs text-[#667085]">
                    {store.orders} orders
                  </span>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </section>
  );
}