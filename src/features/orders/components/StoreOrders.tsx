import { useState, useEffect, useRef } from "react";
import { RefreshCw, Clock, ChevronDown, Check } from "lucide-react";
import { useStoreOrders, useUpdateOrderStatus } from "../hooks/useStoreOrders";
import { type StoreOrder } from "../api/storeOrderService";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-50 text-yellow-700 border border-yellow-200",
  assigned: "bg-blue-50 text-blue-700 border border-blue-200",
  delivered: "bg-green-50 text-green-700 border border-green-200",
  cancelled: "bg-red-50 text-red-700 border border-red-200",
};

const statusLabels: Record<string, string> = {
  pending: "Pending",
  assigned: "Assigned",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function timeAgo(date: string) {
  const diff = Math.floor((Date.now() - new Date(date).getTime()) / 1000);

  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;

  return `${Math.floor(diff / 3600)}h ago`;
}

const tabs = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "assigned", label: "Assigned" },
  { key: "delivered", label: "Delivered" },
  { key: "cancelled", label: "Cancelled" },
];

function OrderStatusDropdown({
  order,
  onChange,
}: {
  order: StoreOrder;
  onChange: (status: StoreOrder["status"]) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const options: { value: StoreOrder["status"]; label: string }[] = [
    { value: "pending", label: "Pending" },
    { value: "assigned", label: "Assigned" },
    { value: "delivered", label: "Delivered" },
    { value: "cancelled", label: "Cancelled" },
  ];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const selectedOption =
    options.find((option) => option.value === order.status) ?? options[0];

  return (
    <div ref={dropdownRef} className="relative w-[135px]">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex h-8 w-full items-center justify-between rounded-lg border border-emerald-700 bg-white px-2.5 text-xs font-medium text-foreground shadow-sm transition-all hover:bg-emerald-50/40 focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
      >
        <span>{selectedOption.label}</span>

        <ChevronDown
          className={`h-3.5 w-3.5 text-emerald-700 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-[38px] z-40 w-[155px] overflow-hidden rounded-lg border border-emerald-100 bg-white shadow-lg">
          {options.map((option) => {
            const isSelected = option.value === order.status;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`flex w-full items-center justify-between px-3 py-2.5 text-left text-xs transition-colors ${
                  isSelected
                    ? "bg-emerald-50 font-semibold text-emerald-700"
                    : "text-foreground hover:bg-emerald-50/60"
                }`}
              >
                <span>{option.label}</span>

                {isSelected && (
                  <Check className="h-3.5 w-3.5 text-emerald-700" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function StoreOrders() {
  const {
    data: orders = [],
    isLoading,
    dataUpdatedAt,
    refetch,
    isFetching,
  } = useStoreOrders();

  const updateStatus = useUpdateOrderStatus();

  const [activeTab, setActiveTab] = useState("all");
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [countdown, setCountdown] = useState(30);

  useEffect(() => {
    const id = setTimeout(() => {
      setLastUpdated(new Date(dataUpdatedAt));
      setCountdown(30);
    }, 0);

    return () => clearTimeout(id);
  }, [dataUpdatedAt]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) return 30;
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const filtered = orders.filter((o) => {
    if (activeTab === "all") return true;
    return o.status === activeTab;
  });

  const countByStatus = (status: string) =>
    orders.filter((o) => o.status === status).length;

  if (isLoading) {
    return (
      <div className="flex min-h-[calc(100vh-80px)] items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading orders...</p>
      </div>
    );
  }

  return (
    <section className="space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">Orders Dashboard</h1>

          <p className="mt-0.5 text-sm text-muted-foreground">
            Real-time view of incoming orders. Auto-refreshes every 30s.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-lg border border-border bg-white px-3 py-2 text-xs text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            <span>Refreshing in {countdown}s</span>
          </div>

          <button
            onClick={() => refetch()}
            className={`flex h-8 items-center gap-2 rounded-lg border border-border px-3 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted/50 ${
              isFetching ? "opacity-50" : ""
            }`}
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${
                isFetching ? "animate-spin" : ""
              }`}
            />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          {
            label: "Total",
            value: orders.length,
            color: "text-foreground",
          },
          {
            label: "Pending",
            value: countByStatus("pending"),
            color: "text-yellow-600",
          },
          {
            label: "Assigned",
            value: countByStatus("assigned"),
            color: "text-blue-600",
          },
          {
            label: "Delivered",
            value: countByStatus("delivered"),
            color: "text-green-600",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-lg border border-border bg-white p-3"
          >
            <p className="text-xs text-muted-foreground">{stat.label}</p>

            <p className={`mt-0.5 text-2xl font-bold ${stat.color}`}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg border border-border bg-white">
        {/* Tabs */}
        <div className="flex items-center border-b border-border px-4">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`whitespace-nowrap border-b-2 px-4 py-3 text-xs font-semibold transition-colors ${
                activeTab === tab.key
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}

          <div className="ml-auto py-3 text-xs text-muted-foreground">
            Last updated:{" "}
            {lastUpdated.toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-border bg-muted/20">
                <th className="whitespace-nowrap px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Order ID
                </th>

                <th className="whitespace-nowrap px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Customer
                </th>

                <th className="whitespace-nowrap px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Items
                </th>

                <th className="whitespace-nowrap px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Total
                </th>

                <th className="whitespace-nowrap px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Status
                </th>

                <th className="whitespace-nowrap px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Time
                </th>

                <th className="whitespace-nowrap px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border">
              {filtered.map((order: StoreOrder) => (
                <tr
                  key={order.id}
                  className="transition-colors hover:bg-muted/20"
                >
                  <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-muted-foreground">
                    #{order.order_id}
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                        {getInitials(order.customer_name)}
                      </div>

                      <span className="whitespace-nowrap text-sm font-medium">
                        {order.customer_name}
                      </span>
                    </div>
                  </td>

                  <td className="whitespace-nowrap px-4 py-3 text-sm">
                    {order.items_count} items
                  </td>

                  <td className="whitespace-nowrap px-4 py-3 text-sm font-semibold">
                    EGP {order.total.toFixed(2)}
                  </td>

                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider ${statusColors[order.status]}`}
                    >
                      {statusLabels[order.status]}
                    </span>
                  </td>

                  <td className="whitespace-nowrap px-4 py-3 text-xs text-muted-foreground">
                    {timeAgo(order.created_at)}
                  </td>

                  <td className="px-4 py-3">
                    <OrderStatusDropdown
                      order={order}
                      onChange={(status) =>
                        updateStatus.mutate({
                          orderId: order.id,
                          status,
                        })
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="border-t border-border px-4 py-3 text-sm text-muted-foreground">
          Showing {filtered.length} of {orders.length} orders
        </div>
      </div>
    </section>
  );
}