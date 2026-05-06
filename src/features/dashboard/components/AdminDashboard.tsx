import type { ElementType, ReactNode } from "react";
import {
  ArrowDown,
  ArrowUp,
  CalendarDays,
  ChevronDown,
  ClipboardList,
  Info,
  Package,
  ShoppingCart,
  Users,
} from "lucide-react";

type Tone = "green" | "orange";

type StatCardProps = {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down";
  icon: ElementType;
  tone: Tone;
};

type OrderStatus = "Delivered" | "Shipped" | "Processing" | "Cancelled";
type SubmissionStatus = "Pending" | "Reviewing";

const stats: StatCardProps[] = [
  {
    title: "Total Products",
    value: "1,248",
    change: "8.5%",
    trend: "up",
    icon: Package,
    tone: "green",
  },
  {
    title: "Total Users",
    value: "3,672",
    change: "12.4%",
    trend: "up",
    icon: Users,
    tone: "green",
  },
  {
    title: "Total Orders",
    value: "2,317",
    change: "15.7%",
    trend: "up",
    icon: ShoppingCart,
    tone: "green",
  },
  {
    title: "Pending Submissions",
    value: "28",
    change: "6.7%",
    trend: "down",
    icon: ClipboardList,
    tone: "orange",
  },
];

const recentOrders = [
  {
    id: "#ORD-7842",
    customer: "Ahmed Khan",
    items: 12,
    total: "$85.40",
    status: "Delivered" as OrderStatus,
    date: "May 18",
  },
  {
    id: "#ORD-7841",
    customer: "Sara Ali",
    items: 7,
    total: "$47.90",
    status: "Shipped" as OrderStatus,
    date: "May 18",
  },
  {
    id: "#ORD-7840",
    customer: "Usman Ahmed",
    items: 9,
    total: "$63.25",
    status: "Processing" as OrderStatus,
    date: "May 18",
  },
  {
    id: "#ORD-7839",
    customer: "Fatima Noor",
    items: 5,
    total: "$31.60",
    status: "Delivered" as OrderStatus,
    date: "May 17",
  },
  {
    id: "#ORD-7838",
    customer: "Bilal Hassan",
    items: 14,
    total: "$97.10",
    status: "Cancelled" as OrderStatus,
    date: "May 17",
  },
];

const submissions = [
  {
    id: 1,
    title: "Organic Honey 500g",
    category: "Pantry Staples",
    submittedBy: "Zain Foods",
    time: "2 hours ago",
    status: "Pending" as SubmissionStatus,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR7dPqaitFRJPJIkau33ynbyg1JWCrHcAjrSW7vwXkY-ZEdMOdv4_CrmEI&s",
  },
  {
    id: 2,
    title: "Almonds 250g",
    category: "Snacks & Beverages",
    submittedBy: "Healthy Hub",
    time: "5 hours ago",
    status: "Pending" as SubmissionStatus,
    image:
      "https://images.unsplash.com/photo-1508061253366-f7da158b6d46?auto=format&fit=crop&w=160&q=80",
  },
  {
    id: 3,
    title: "Olive Oil 1L",
    category: "Pantry Staples",
    submittedBy: "Green Valley",
    time: "1 day ago",
    status: "Reviewing" as SubmissionStatus,
    image:
      "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=160&q=80",
  },
  {
    id: 4,
    title: "Tuna Chunks 185g",
    category: "Canned Food",
    submittedBy: "Sea Fresh",
    time: "1 day ago",
    status: "Pending" as SubmissionStatus,
    image:
      "https://images.unsplash.com/photo-1515543904379-3d757afe72e4?auto=format&fit=crop&w=160&q=80",
  },
];

const categoryItems = [
  {
    label: "Fruits & Vegetables",
    percent: 28,
    count: 347,
    dot: "bg-[#16A34A]",
  },
  {
    label: "Dairy & Eggs",
    percent: 22,
    count: 274,
    dot: "bg-[#FBBF24]",
  },
  {
    label: "Snacks & Beverages",
    percent: 18,
    count: 224,
    dot: "bg-[#EC4899]",
  },
  {
    label: "Pantry Staples",
    percent: 16,
    count: 200,
    dot: "bg-[#84A36E]",
  },
  {
    label: "Meat & Fish",
    percent: 10,
    count: 128,
    dot: "bg-[#8B5CF6]",
  },
  {
    label: "Others",
    percent: 6,
    count: 75,
    dot: "bg-[#A5B4FC]",
  },
];

function getStatTone(tone: Tone) {
  const tones = {
    green: "bg-[#EAF7EE] text-[#16A34A]",
    orange: "bg-[#FFF4D8] text-[#D97706]",
  };

  return tones[tone];
}

function getStatusClasses(status: OrderStatus | SubmissionStatus) {
  switch (status) {
    case "Delivered":
      return "bg-[#EAF7EE] text-[#16A34A]";
    case "Shipped":
      return "bg-[#EAF1FF] text-[#2563EB]";
    case "Processing":
      return "bg-[#FFF4D8] text-[#D97706]";
    case "Cancelled":
      return "bg-[#FEE2E2] text-[#EF4444]";
    case "Pending":
      return "bg-[#FFF4D8] text-[#D97706]";
    case "Reviewing":
      return "bg-[#EAF1FF] text-[#2563EB]";
    default:
      return "bg-[#F3F4F6] text-[#6B7280]";
  }
}

function SectionCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`min-w-0 rounded-xl border border-[#E7EBF0] bg-white p-4 shadow-[0_2px_10px_rgba(15,23,42,0.04)] ${className}`}
    >
      {children}
    </div>
  );
}

function MetricCard({
  title,
  value,
  change,
  trend,
  icon: Icon,
  tone,
}: StatCardProps) {
  const isUp = trend === "up";

  return (
    <SectionCard className="min-h-[124px] p-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-[#667085]">{title}</p>

          <h3 className="mt-1.5 text-[24px] font-bold tracking-tight text-[#101828]">
            {value}
          </h3>
        </div>

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${getStatTone(
            tone
          )}`}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>

      <div className="mt-2.5 flex items-center gap-2 text-xs">
        <span
          className={`inline-flex items-center gap-1 font-semibold ${
            isUp ? "text-[#16A34A]" : "text-[#F97316]"
          }`}
        >
          {isUp ? (
            <ArrowUp className="h-3.5 w-3.5" />
          ) : (
            <ArrowDown className="h-3.5 w-3.5" />
          )}
          {change}
        </span>

        <span className="text-[#98A2B3]">vs last week</span>
      </div>
    </SectionCard>
  );
}

function ChartSelect({ label }: { label: string }) {
  return (
    <button
      type="button"
      className="inline-flex h-9 shrink-0 items-center gap-2 rounded-lg border border-[#E7EBF0] bg-white px-3 text-xs font-semibold text-[#344054] outline-none transition hover:bg-[#F9FAFB] focus:border-[#E7EBF0] focus:ring-0"
    >
      {label}
      <ChevronDown className="h-4 w-4" />
    </button>
  );
}

function AreaLineChart({
  values,
  max = 30,
  lineColor = "#16A34A",
}: {
  values: number[];
  max?: number;
  lineColor?: string;
}) {
  const width = 420;
  const height = 110;
  const paddingX = 10;
  const paddingY = 10;

  const innerWidth = width - paddingX * 2;
  const innerHeight = height - paddingY * 2;
  const stepX = innerWidth / (values.length - 1);

  const points = values.map((value, index) => {
    const x = paddingX + index * stepX;
    const y = paddingY + innerHeight - (value / max) * innerHeight;
    return `${x},${y}`;
  });

  const areaPoints = [
    `${paddingX},${height - paddingY}`,
    ...points,
    `${paddingX + innerWidth},${height - paddingY}`,
  ].join(" ");

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-[110px] w-full">
      <defs>
        <linearGradient id="areaFillGreen" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={lineColor} stopOpacity="0.2" />
          <stop offset="100%" stopColor={lineColor} stopOpacity="0.03" />
        </linearGradient>
      </defs>

      {[0, 1, 2].map((index) => {
        const y = paddingY + (innerHeight / 2) * index;

        return (
          <line
            key={index}
            x1={paddingX}
            x2={width - paddingX}
            y1={y}
            y2={y}
            stroke="#EAECF0"
            strokeWidth="1"
          />
        );
      })}

      <polygon points={areaPoints} fill="url(#areaFillGreen)" />

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

function SalesOverviewCard() {
  return (
    <SectionCard className="p-3.5">
      <div className="mb-2 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-[15px] font-bold text-[#101828]">
              Sales Overview
            </h3>
            <Info className="h-4 w-4 shrink-0 text-[#98A2B3]" />
          </div>

          <div className="mt-2 flex items-center gap-3">
            <span className="text-[18px] font-bold text-[#101828]">
              $24,780.50
            </span>

            <span className="inline-flex items-center gap-1 text-sm font-semibold text-[#16A34A]">
              <ArrowUp className="h-4 w-4" />
              18.6%
            </span>
          </div>
        </div>

        <ChartSelect label="This Week" />
      </div>

      <div className="grid grid-cols-[36px_1fr] gap-2">
        <div className="flex h-[110px] flex-col justify-between pb-3 text-xs font-medium text-[#98A2B3]">
          <span>$30k</span>
          <span>$20k</span>
          <span>$10k</span>
          <span>$0</span>
        </div>

        <div className="min-w-0">
          <AreaLineChart
            values={[12, 20, 20, 22, 19, 22, 21, 25, 23, 27, 23, 25]}
          />

          <div className="mt-1 grid grid-cols-7 text-center text-[10px] font-medium leading-tight text-[#98A2B3]">
            <span>
              May
              <br />
              12
            </span>
            <span>
              May
              <br />
              13
            </span>
            <span>
              May
              <br />
              14
            </span>
            <span>
              May
              <br />
              15
            </span>
            <span>
              May
              <br />
              16
            </span>
            <span>
              May
              <br />
              17
            </span>
            <span>
              May
              <br />
              18
            </span>
          </div>
        </div>
      </div>
    </SectionCard>
  );
}

function OrdersTrendCard() {
  return (
    <SectionCard className="p-3.5">
      <div className="mb-2 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-[15px] font-bold text-[#101828]">
              Orders Trend
            </h3>
            <Info className="h-4 w-4 shrink-0 text-[#98A2B3]" />
          </div>

          <div className="mt-2 flex items-center gap-3">
            <span className="text-[18px] font-bold text-[#101828]">2,317</span>

            <span className="inline-flex items-center gap-1 text-sm font-semibold text-[#16A34A]">
              <ArrowUp className="h-4 w-4" />
              15.7%
            </span>
          </div>
        </div>

        <ChartSelect label="This Week" />
      </div>

      <div className="grid grid-cols-[36px_1fr] gap-2">
        <div className="flex h-[110px] flex-col justify-between pb-3 text-xs font-medium text-[#98A2B3]">
          <span>800</span>
          <span>600</span>
          <span>400</span>
          <span>0</span>
        </div>

        <div className="min-w-0">
          <AreaLineChart
            values={[16, 20, 21, 19, 9, 15, 12, 18, 16, 19, 18, 15]}
            max={24}
          />

          <div className="mt-1 grid grid-cols-7 text-center text-[10px] font-medium leading-tight text-[#98A2B3]">
            <span>
              May
              <br />
              12
            </span>
            <span>
              May
              <br />
              13
            </span>
            <span>
              May
              <br />
              14
            </span>
            <span>
              May
              <br />
              15
            </span>
            <span>
              May
              <br />
              16
            </span>
            <span>
              May
              <br />
              17
            </span>
            <span>
              May
              <br />
              18
            </span>
          </div>
        </div>
      </div>
    </SectionCard>
  );
}

function CategoryDistributionCard() {
  return (
    <SectionCard className="p-3.5">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <h3 className="truncate text-[15px] font-bold text-[#101828]">
            Category Distribution
          </h3>
          <Info className="h-4 w-4 shrink-0 text-[#98A2B3]" />
        </div>

        <ChartSelect label="Products" />
      </div>

      <div className="grid items-center gap-4 xl:grid-cols-[130px_minmax(0,1fr)]">
        <div className="flex items-center justify-center">
          <div
            className="relative h-[124px] w-[124px] rounded-full shadow-sm"
            style={{
              background:
                "conic-gradient(#16A34A 0% 28%, #FBBF24 28% 50%, #EC4899 50% 68%, #3B82F6 68% 84%, #8B5CF6 84% 94%, #A5B4FC 94% 100%)",
            }}
          >
            <div className="absolute left-1/2 top-1/2 flex h-[72px] w-[72px] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full bg-white">
              <span className="text-[19px] font-bold leading-none text-[#101828]">
                1,248
              </span>
              <span className="mt-1 text-xs text-[#667085]">Total</span>
            </div>
          </div>
        </div>

        <div className="min-w-0 space-y-2">
          {categoryItems.map((item) => (
            <div
              key={item.label}
              className="grid grid-cols-[minmax(145px,1fr)_36px_34px] items-center gap-2 text-xs"
            >
              <div className="flex min-w-0 items-center gap-2">
                <span
                  className={`h-2.5 w-2.5 shrink-0 rounded-full ${item.dot}`}
                />
                <span className="truncate font-medium text-[#344054]">
                  {item.label}
                </span>
              </div>

              <span className="text-right font-semibold text-[#475467]">
                {item.percent}%
              </span>

              <span className="text-right text-[#667085]">{item.count}</span>
            </div>
          ))}
        </div>
      </div>
    </SectionCard>
  );
}

function OrdersTableCard() {
  return (
    <SectionCard>
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="text-base font-bold text-[#101828]">Recent Orders</h3>

        <button
          type="button"
          className="rounded-lg border border-[#E7EBF0] px-4 py-2 text-sm font-semibold text-[#344054]"
        >
          View All
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-[#EAECF0]">
        <table className="w-full table-fixed text-[11px]">
          <thead className="bg-[#F9FAFB] text-[10px] font-semibold uppercase text-[#667085]">
            <tr>
              <th className="w-[90px] px-3 py-3 text-left">Order ID</th>
              <th className="w-[120px] px-3 py-3 text-left">Customer</th>
              <th className="w-[50px] px-2 py-3 text-center">Items</th>
              <th className="w-[70px] px-3 py-3 text-left">Total</th>
              <th className="w-[90px] px-3 py-3 text-left">Status</th>
              <th className="w-[65px] px-2 py-3 text-left">Date</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[#EAECF0]">
            {recentOrders.map((order) => (
              <tr key={order.id} className="bg-white">
                <td className="whitespace-nowrap px-3 py-3 font-medium text-[#344054]">
                  {order.id}
                </td>

                <td className="truncate px-3 py-3 text-[#344054]">
                  {order.customer}
                </td>

                <td className="whitespace-nowrap px-2 py-3 text-center text-[#344054]">
                  {order.items}
                </td>

                <td className="whitespace-nowrap px-3 py-3 text-[#344054]">
                  {order.total}
                </td>

                <td className="whitespace-nowrap px-3 py-3">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold ${getStatusClasses(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                </td>

                <td className="whitespace-nowrap px-2 py-3 text-[#667085]">
                  {order.date}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SectionCard>
  );
}

function ProductThumb({ image, title }: { image: string; title: string }) {
  return (
    <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-[#EAECF0] bg-[#F9FAFB] shadow-sm">
      <img
        src={image}
        alt={title}
        className="h-full w-full object-cover"
        loading="lazy"
      />
    </div>
  );
}

function SubmissionsCard() {
  return (
    <SectionCard>
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="text-base font-bold text-[#101828]">
          Recent Submissions
        </h3>

        <button
          type="button"
          className="rounded-lg border border-[#E7EBF0] px-4 py-2 text-sm font-semibold text-[#344054]"
        >
          View All
        </button>
      </div>

      <div className="space-y-3">
        {submissions.map((item) => (
          <div
            key={item.id}
            className="grid min-w-0 grid-cols-[48px_minmax(0,1fr)_115px_auto] items-center gap-3 border-b border-[#EAECF0] pb-3 last:border-b-0 last:pb-0"
          >
            <ProductThumb image={item.image} title={item.title} />

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-[#101828]">
                {item.title}
              </p>
              <p className="mt-1 truncate text-xs text-[#667085]">
                {item.category}
              </p>
            </div>

            <div className="min-w-0 text-xs">
              <p className="truncate text-[#667085]">Submitted by</p>
              <p className="truncate font-semibold text-[#344054]">
                {item.submittedBy}
              </p>
              <p className="truncate text-[#667085]">{item.time}</p>
            </div>

            <span
              className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${getStatusClasses(
                item.status
              )}`}
            >
              {item.status}
            </span>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}

export default function AdminDashboard() {
  return (
    <section className="space-y-3">
      <div className="flex flex-col justify-between gap-3 lg:flex-row lg:items-center">
        <div>
          <h1 className="text-[24px] font-bold tracking-tight text-[#101828]">
            Admin Dashboard
          </h1>
          <p className="mt-1 text-[15px] text-[#667085]">
            Welcome back! Here's what's happening with your store today.
          </p>
        </div>

        <button
          type="button"
          className="inline-flex w-fit items-center gap-2 rounded-lg border border-[#E7EBF0] bg-white px-4 py-2.5 text-sm font-semibold text-[#344054] shadow-[0_2px_10px_rgba(15,23,42,0.04)]"
        >
          <CalendarDays className="h-4 w-4" />
          May 12 – May 18, 2025
          <ChevronDown className="h-4 w-4" />
        </button>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <MetricCard key={stat.title} {...stat} />
        ))}
      </div>

      <div className="grid min-w-0 items-start gap-3 xl:grid-cols-[0.9fr_0.9fr_1.3fr]">
        <SalesOverviewCard />
        <OrdersTrendCard />
        <CategoryDistributionCard />
      </div>

      <div className="grid min-w-0 items-start gap-3 xl:grid-cols-[1.25fr_1fr]">
        <OrdersTableCard />
        <SubmissionsCard />
      </div>
    </section>
  );
}