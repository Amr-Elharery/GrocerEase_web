import { useMemo, useState } from "react";
import { useOrders } from "../hooks/useOrders";
import { type Order } from "../api/orderService";
import { Filter, RotateCcw, Search } from "lucide-react";

const statusColors: Record<string, string> = {
  pending: "border border-[#FCD34D] bg-[#FFF4D8] text-[#D97706]",
  processing: "border border-[#BFDBFE] bg-[#EAF1FF] text-[#2563EB]",
  out_for_delivery: "border border-[#DDD6FE] bg-[#F3E8FF] text-[#7E22CE]",
  delivered: "border border-[#BBF7D0] bg-[#EAF7EE] text-[#16A34A]",
  cancelled: "border border-[#FECACA] bg-[#FEE2E2] text-[#DC2626]",
};

const statusLabels: Record<string, string> = {
  pending: "Pending",
  processing: "Processing",
  out_for_delivery: "Out for Delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const paymentColors: Record<string, string> = {
  cash: "border border-[#FDBA74] bg-[#FFF7ED] text-[#EA580C]",
  card: "border border-[#BFDBFE] bg-[#EAF1FF] text-[#2563EB]",
};

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function formatOrderDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export default function OrderList() {
  const { data: orders = [], isLoading } = useOrders();

  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [search, setSearch] = useState("");

  const countByStatus = (status: string) => {
    return orders.filter((order) => order.status === status).length;
  };

  const filtered = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return orders.filter((order) => {
      const matchesStatus =
        statusFilter === "all" || order.status === statusFilter;

      const matchesPayment =
        paymentFilter === "all" || order.payment_method === paymentFilter;

      const matchesSearch =
        !searchValue ||
        order.order_id.toLowerCase().includes(searchValue) ||
        order.customer_name.toLowerCase().includes(searchValue) ||
        order.store_name.toLowerCase().includes(searchValue);

      return matchesStatus && matchesPayment && matchesSearch;
    });
  }, [orders, statusFilter, paymentFilter, search]);

  const resetFilters = () => {
    setStatusFilter("all");
    setPaymentFilter("all");
    setSearch("");
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[calc(100vh-64px)] items-center justify-center">
        <p className="text-sm text-[#667085]">Loading orders...</p>
      </div>
    );
  }

  return (
    <section className="mx-auto max-w-[1420px] space-y-4">
      {/* Header */}
      <div className="flex flex-col justify-between gap-3 lg:flex-row lg:items-center">
        <div>
          <h1 className="text-[38px] font-bold tracking-tight text-[#101828]">
            Orders
          </h1>

          <p className="mt-1 text-sm text-[#667085]">
            Track and manage all customer orders.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        {[
          {
            label: "Total",
            value: orders.length,
            color: "text-[#101828]",
          },
          {
            label: "Pending",
            value: countByStatus("pending"),
            color: "text-[#D97706]",
          },
          {
            label: "Processing",
            value: countByStatus("processing"),
            color: "text-[#2563EB]",
          },
          {
            label: "Delivered",
            value: countByStatus("delivered"),
            color: "text-[#16A34A]",
          },
          {
            label: "Cancelled",
            value: countByStatus("cancelled"),
            color: "text-[#DC2626]",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-[#DDE7DF] bg-white px-3 py-2.5 shadow-[0_2px_10px_rgba(15,23,42,0.04)]"
          >
            <p className="text-sm font-medium text-[#667085]">{stat.label}</p>

            <p className={`mt-0.5 text-[22px] font-bold ${stat.color}`}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Table Card */}
      <div className="overflow-hidden rounded-xl border border-[#DDE7DF] bg-white shadow-[0_2px_10px_rgba(15,23,42,0.04)]">
        {/* Filter Bar */}
        <div className="border-b border-[#DDE7DF] bg-white px-4 py-2.5">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#EAF7EE] text-[#2D6A4F]">
                <Filter className="h-4 w-4" />
              </div>

              <div className="min-w-0">
                <p className="text-sm font-semibold text-[#101828]">
                  Filter Orders
                </p>
                <p className="text-[11px] text-[#667085]">
                  Refine orders by status, payment, or search.
                </p>
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-2 xl:flex xl:items-center">
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="h-10 w-[165px] rounded-lg border border-[#DDE7DF] bg-[#F8FAF8] px-3 text-sm font-medium text-[#344054] outline-none transition focus:border-[#2D6A4F] focus:ring-2 focus:ring-[#2D6A4F]/10"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="out_for_delivery">Out for Delivery</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>

              <select
                value={paymentFilter}
                onChange={(event) => setPaymentFilter(event.target.value)}
                className="h-10 w-[165px] rounded-lg border border-[#DDE7DF] bg-[#F8FAF8] px-3 text-sm font-medium text-[#344054] outline-none transition focus:border-[#2D6A4F] focus:ring-2 focus:ring-[#2D6A4F]/10"
              >
                <option value="all">All Payments</option>
                <option value="cash">Cash</option>
                <option value="card">Card</option>
              </select>

              <div className="relative md:col-span-2 xl:w-[220px]">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#667085]" />

                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search orders..."
                  className="h-10 w-full rounded-lg border border-[#DDE7DF] bg-[#F8FAF8] pl-9 pr-3 text-sm text-[#101828] outline-none transition placeholder:text-[#98A2B3] focus:border-[#2D6A4F] focus:ring-2 focus:ring-[#2D6A4F]/10"
                />
              </div>

              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-[#DDE7DF] bg-white px-3 text-sm font-semibold text-[#5F7168] transition hover:bg-[#F8FAF8]"
              >
                <RotateCcw className="h-4 w-4" />
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-hidden">
          <table className="w-full table-fixed border-collapse text-left">
            <thead>
              <tr className="border-b border-[#DDE7DF] bg-[#F8FAF8] text-[11px] font-semibold uppercase tracking-wide text-[#5F7168]">
                <th className="w-[105px] px-4 py-3">Order ID</th>
                <th className="w-[185px] px-4 py-3">Customer</th>
                <th className="w-[145px] px-4 py-3">Store</th>
                <th className="w-[78px] px-4 py-3">Items</th>
                <th className="w-[120px] px-4 py-3">Total</th>
                <th className="w-[105px] px-4 py-3">Payment</th>
                <th className="w-[128px] px-4 py-3">Status</th>
                <th className="w-[100px] px-4 py-3">Date</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#DDE7DF]">
              {filtered.map((order: Order) => (
                <tr key={order.id} className="transition hover:bg-[#F8FAF8]">
                  <td className="truncate px-4 py-2.5 font-mono text-xs text-[#5F7168]">
                    #{order.order_id}
                  </td>

                  <td className="px-4 py-2.5">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#078A2D] text-[10px] font-bold text-white">
                        {getInitials(order.customer_name)}
                      </div>

                      <span className="truncate text-sm font-semibold text-[#101828]">
                        {order.customer_name}
                      </span>
                    </div>
                  </td>

                  <td className="truncate px-4 py-2.5 text-sm text-[#5F7168]">
                    {order.store_name}
                  </td>

                  <td className="whitespace-nowrap px-4 py-2.5 text-sm text-[#101828]">
                    {order.items_count} items
                  </td>

                  <td className="whitespace-nowrap px-4 py-2.5 text-sm font-semibold text-[#101828]">
                    EGP {order.total_price.toFixed(2)}
                  </td>

                  <td className="px-4 py-2.5">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide ${
                        paymentColors[order.payment_method] ??
                        "border border-[#E5E7EB] bg-[#F3F4F6] text-[#667085]"
                      }`}
                    >
                      {order.payment_method}
                    </span>
                  </td>

                  <td className="px-4 py-2.5">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide ${
                        statusColors[order.status] ??
                        "border border-[#E5E7EB] bg-[#F3F4F6] text-[#667085]"
                      }`}
                    >
                      {statusLabels[order.status] ?? order.status}
                    </span>
                  </td>

                  <td className="whitespace-nowrap px-4 py-2.5 text-xs text-[#5F7168]">
                    {formatOrderDate(order.created_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="border-t border-[#DDE7DF] px-5 py-2.5 text-sm text-[#667085]">
          Showing{" "}
          <span className="font-semibold text-[#101828]">
            {filtered.length}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-[#101828]">{orders.length}</span>{" "}
          orders
        </div>
      </div>
    </section>
  );
}