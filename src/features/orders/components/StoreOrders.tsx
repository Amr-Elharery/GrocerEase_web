import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { RefreshCw, Clock, ChevronDown, Check } from "lucide-react";
import { useStoreOrders, useUpdateOrderStatus } from "../hooks/useStoreOrders";
import { type StoreOrder } from "../api/storeOrderService";
import StoreOrderDetailModal from "./StoreOrderDetailModal";

const statusColors: Record<string, string> = {
  pending: "border border-[#FCD34D] bg-[#FFF4D8] text-[#D97706]",
  processing: "border border-[#BFDBFE] bg-[#EAF1FF] text-[#2563EB]",
  assigned: "border border-[#BFDBFE] bg-[#EAF1FF] text-[#2563EB]",
  out_for_delivery: "border border-[#DDD6FE] bg-[#F3E8FF] text-[#7E22CE]",
  picked_up: "border border-[#A7F3D0] bg-[#ECFDF5] text-[#059669]",
  delivered: "border border-[#BBF7D0] bg-[#EAF7EE] text-[#16A34A]",
  cancelled: "border border-[#FECACA] bg-[#FEE2E2] text-[#DC2626]",
};

const statusKeys: Record<string, string> = {
  pending: "pending",
  processing: "processing",
  assigned: "assigned",
  out_for_delivery: "outForDelivery",
  picked_up: "pickedUp",
  delivered: "delivered",
  cancelled: "cancelled",
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


function StatusFilterDropdown({
  value,
  options,
  onChange,
}: {
  value: string;
  options: { key: string; label: string }[];
  onChange: (v: string) => void;
}) {
  const { t } = useTranslation(["orders"]);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = options.find((opt) => opt.key === value) ?? options[0];

  useEffect(() => {
    function onOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onOutside);
    return () => document.removeEventListener("mousedown", onOutside);
  }, []);

  return (
    <div ref={ref} className="relative w-[190px]">
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="flex h-9 w-full items-center justify-between rounded-lg border border-[#078A2D] bg-white px-3 text-sm font-semibold text-[#101828] shadow-sm transition hover:bg-[#F0FDF4]"
      >
        <span className={value === "all" ? "text-[#667085] font-medium" : ""}>
          {value === "all" ? t("orders:storeOrders.filterByStatus") : selected.label}
        </span>
        <ChevronDown className={`h-4 w-4 text-[#078A2D] transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute start-0 top-[42px] z-50 w-full overflow-hidden rounded-lg border border-[#CDE8D5] bg-white shadow-[0_12px_30px_rgba(15,23,42,0.12)]">
          {options.map((opt) => (
            <button
              key={opt.key}
              type="button"
              onClick={() => { onChange(opt.key); setOpen(false); }}
              className={`flex w-full items-center justify-between px-3 py-2.5 text-start text-sm transition ${
                value === opt.key ? "bg-[#EAF7EE] font-semibold text-[#078A2D]" : "text-[#101828] hover:bg-[#F0FDF4]"
              }`}
            >
              <span>{opt.label}</span>
              {value === opt.key && <Check className="h-4 w-4 text-[#078A2D]" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function OrderStatusDropdown({
  order,
  onChange,
}: {
  order: StoreOrder;
  onChange: (status: StoreOrder["status"]) => void;
}) {
  const { t } = useTranslation(["orders"]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const options: { value: StoreOrder["status"]; label: string }[] = [
    { value: "pending", label: t("orders:statuses.pending") },
    { value: "assigned", label: t("orders:statuses.assigned") },
    { value: "delivered", label: t("orders:statuses.delivered") },
    { value: "cancelled", label: t("orders:statuses.cancelled") },
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
        <div className="absolute end-0 top-[38px] z-40 w-[155px] overflow-hidden rounded-lg border border-emerald-100 bg-white shadow-lg">
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
                className={`flex w-full items-center justify-between px-3 py-2.5 text-start text-xs transition-colors ${
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
  const { t } = useTranslation(["common", "orders"]);
  const [page, setPage] = useState(1);
  const {
    data: orders = [],
    isLoading,
    dataUpdatedAt,
    refetch,
    isFetching,
  } = useStoreOrders(page);

  const updateStatus = useUpdateOrderStatus();

  const getStatusLabel = (status: string) => {
    const key = statusKeys[status];
    return key
      ? t(`orders:statuses.${key}`)
      : status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  };

  const [activeTab, setActiveTab] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<StoreOrder | null>(null);
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
    return o.status.toLowerCase() === activeTab.toLowerCase();
  });

  const uniqueStatuses = [...new Set(orders.map((o) => o.status).filter(Boolean))];
  const statusOptions = [
    { key: "all", label: t("orders:storeOrders.all") },
    ...uniqueStatuses.map((s) => ({
      key: s,
      label: getStatusLabel(s),
    })),
  ];

  if (isLoading) {
    return (
      <div className="flex min-h-[calc(100vh-80px)] items-center justify-center">
        <p className="text-sm text-muted-foreground">{t("orders:storeOrders.loading")}</p>
      </div>
    );
  }

  return (
    <section className="space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t("orders:storeOrders.title")}</h1>

          <p className="mt-0.5 text-sm text-muted-foreground">
            {t("orders:storeOrders.subtitle")}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-lg border border-border bg-white px-3 py-2 text-xs text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            <span>{t("orders:storeOrders.refreshingIn", { n: countdown })}</span>
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
            {t("orders:storeOrders.refresh")}
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-visible rounded-lg border border-border bg-white">
        {/* Filter */}
        <div className="flex items-center gap-3 border-b border-border px-4 py-3">
          <StatusFilterDropdown value={activeTab} options={statusOptions} onChange={setActiveTab} />
          <div className="ms-auto text-xs text-muted-foreground">
            {t("orders:storeOrders.lastUpdated")}{" "}
            {lastUpdated.toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse text-start">
            <thead>
              <tr className="border-b border-border bg-muted/20">
                <th className="whitespace-nowrap px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {t("orders:storeOrders.columns.orderId")}
                </th>

                <th className="whitespace-nowrap px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {t("orders:storeOrders.columns.customer")}
                </th>

                <th className="whitespace-nowrap px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {t("orders:storeOrders.columns.items")}
                </th>

                <th className="whitespace-nowrap px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {t("orders:storeOrders.columns.total")}
                </th>

                <th className="whitespace-nowrap px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {t("orders:storeOrders.columns.status")}
                </th>

                <th className="whitespace-nowrap px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {t("orders:storeOrders.columns.time")}
                </th>

                <th className="whitespace-nowrap px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {t("orders:storeOrders.columns.actions")}
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border">
              {filtered.map((order: StoreOrder) => (
                <tr
                  key={order.id}
                  onClick={() => setSelectedOrder(order)}
                  className="cursor-pointer transition-colors hover:bg-muted/20"
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
                    {t("orders:storeOrders.itemsCount", { n: order.items_count })}
                  </td>

                  <td className="whitespace-nowrap px-4 py-3 text-sm font-semibold">
                    EGP {order.total.toFixed(2)}
                  </td>

                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide ${
                        statusColors[order.status] ?? "border border-[#E5E7EB] bg-[#F3F4F6] text-[#667085]"
                      }`}
                    >
                      {getStatusLabel(order.status)}
                    </span>
                  </td>

                  <td className="whitespace-nowrap px-4 py-3 text-xs text-muted-foreground">
                    {timeAgo(order.created_at)}
                  </td>

                  <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
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

        <div className="flex items-center justify-between border-t border-border px-4 py-3">
          <p className="text-sm text-muted-foreground">
            {t("orders:storeOrders.showing", { filtered: filtered.length, total: orders.length })}
          </p>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="flex h-8 items-center justify-center rounded-lg border border-border px-3 text-xs font-semibold text-muted-foreground transition hover:bg-muted/50 disabled:opacity-40"
            >
              {t("common:actions.previous")}
            </button>
            <span className="px-2 text-xs font-semibold text-foreground">{page}</span>
            <button
              type="button"
              onClick={() => setPage((p) => p + 1)}
              disabled={orders.length < 10}
              className="flex h-8 items-center justify-center rounded-lg border border-border px-3 text-xs font-semibold text-muted-foreground transition hover:bg-muted/50 disabled:opacity-40"
            >
              {t("common:actions.next")}
            </button>
          </div>
        </div>
      </div>

      {selectedOrder && (
        <StoreOrderDetailModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
      )}
    </section>
  );
}