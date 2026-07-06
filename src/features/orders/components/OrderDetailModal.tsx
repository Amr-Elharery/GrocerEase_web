import { useTranslation } from "react-i18next";
import { X, User, Store, Package, CreditCard, Clock } from "lucide-react";
import { type Order } from "../api/orderService";
import { useOrder } from "../hooks/useOrders";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-50 text-yellow-700 border border-yellow-200",
  processing: "bg-blue-50 text-blue-700 border border-blue-200",
  out_for_delivery: "bg-purple-50 text-purple-700 border border-purple-200",
  picked_up: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  delivered: "bg-green-50 text-green-700 border border-green-200",
  cancelled: "bg-red-50 text-red-700 border border-red-200",
};

const statusKeys: Record<string, string> = {
  pending: "pending",
  processing: "processing",
  out_for_delivery: "outForDelivery",
  picked_up: "pickedUp",
  delivered: "delivered",
  cancelled: "cancelled",
};

type Props = {
  order: Order;
  onClose: () => void;
};

export default function OrderDetailModal({ order, onClose }: Props) {
  const { t } = useTranslation(["common", "orders"]);
  const { data: details } = useOrder(order.id);
  const statusKey = statusKeys[order.status];
  const statusLabel = statusKey
    ? t(`orders:statuses.${statusKey}`)
    : order.status.replace(/_/g, " ");
  const paymentLabel = t(`orders:paymentMethods.${order.payment_method.toLowerCase()}`, {
    defaultValue: order.payment_method,
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6">
      <div className="flex max-h-[78vh] w-full max-w-md flex-col overflow-hidden rounded-xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-border px-5 py-4">
          <div>
            <h2 className="text-base font-semibold">{t("orders:detailModal.title")}</h2>
            <p className="mt-0.5 font-mono text-xs text-muted-foreground">
              #{order.order_id}
            </p>
          </div>

          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted/50"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 space-y-4 overflow-y-auto p-5">
          {/* Status */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {t("orders:detailModal.status")}
            </span>

            <span
              className={`rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider ${
                statusColors[order.status] ?? "bg-gray-100 text-gray-600 border border-gray-200"
              }`}
            >
              {statusLabel}
            </span>
          </div>

          {/* Order Info */}
          <div className="space-y-3 rounded-lg bg-muted/30 p-4">
            <div className="flex items-center gap-2.5">
              <User className="h-4 w-4 shrink-0 text-muted-foreground" />
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{t("orders:detailModal.customer")}</p>
                <p className="text-sm font-semibold">{order.customer_name}</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <Store className="h-4 w-4 shrink-0 text-muted-foreground" />
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{t("orders:detailModal.store")}</p>
                <p className="text-sm font-semibold">{order.store_name}</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <Package className="h-4 w-4 shrink-0 text-muted-foreground" />
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{t("orders:detailModal.totalItems")}</p>
                <p className="text-sm font-semibold">{t("orders:detailModal.itemsCount", { n: order.items_count })}</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <CreditCard className="h-4 w-4 shrink-0 text-muted-foreground" />
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{t("orders:detailModal.totalPayment")}</p>
                <p className="text-sm font-semibold">
                  EGP {order.total_price.toFixed(2)}{" "}
                  <span className="text-xs font-normal capitalize text-muted-foreground">
                    ({paymentLabel})
                  </span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <Clock className="h-4 w-4 shrink-0 text-muted-foreground" />
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{t("orders:detailModal.placedAt")}</p>
                <p className="text-sm font-semibold">
                  {new Date(order.created_at).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Order Items */}
          {details && details.order_items.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {t("orders:detailModal.products", { n: details.order_items.length })}
              </p>
              <div className="space-y-1.5 rounded-lg border border-border p-2">
                {details.order_items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      {t("orders:detailModal.item", { id: item.shop_product_id })} <span className="text-foreground">×{item.quantity}</span>
                    </span>
                    <span className="font-medium">EGP {item.total.toFixed(2)}</span>
                  </div>
                ))}
                <div className="mt-1 space-y-1 border-t border-border pt-1.5">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{t("orders:detailModal.subtotal")}</span>
                    <span>EGP {details.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{t("orders:detailModal.deliveryFee")}</span>
                    <span>EGP {details.delivery_fee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-semibold">
                    <span>{t("orders:detailModal.total")}</span>
                    <span>EGP {(details.subtotal + details.delivery_fee).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="shrink-0 border-t border-border px-5 py-4">
          <button
            onClick={onClose}
            className="h-9 w-full rounded-lg border border-border text-sm font-semibold text-muted-foreground transition hover:bg-muted/50"
          >
            {t("common:actions.close")}
          </button>
        </div>
      </div>
    </div>
  );
}