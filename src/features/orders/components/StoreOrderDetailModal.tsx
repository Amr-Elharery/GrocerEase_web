import { X, User, Package, CreditCard, Clock } from "lucide-react";
import { type StoreOrder } from "../api/storeOrderService";
import { useStoreOrder } from "../hooks/useStoreOrders";

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

export default function StoreOrderDetailModal({
  order,
  onClose,
}: {
  order: StoreOrder;
  onClose: () => void;
}) {
  const { data: details } = useStoreOrder(order.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6">
      <div className="flex max-h-[78vh] w-full max-w-md flex-col overflow-hidden rounded-xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-border px-5 py-4">
          <div>
            <h2 className="text-base font-semibold">Order Details</h2>
            <p className="mt-0.5 font-mono text-xs text-muted-foreground">#{order.order_id}</p>
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
              Status
            </span>
            <span
              className={`rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider ${
                statusColors[order.status] ?? "bg-gray-100 text-gray-600 border border-gray-200"
              }`}
            >
              {statusLabels[order.status] ?? order.status.replace(/_/g, " ")}
            </span>
          </div>

          {/* Order Info */}
          <div className="space-y-3 rounded-lg bg-muted/30 p-4">
            <div className="flex items-center gap-2.5">
              <User className="h-4 w-4 shrink-0 text-muted-foreground" />
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Customer</p>
                <p className="text-sm font-semibold">{order.customer_name}</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <Package className="h-4 w-4 shrink-0 text-muted-foreground" />
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Total Items</p>
                <p className="text-sm font-semibold">{order.items_count} items</p>
              </div>
            </div>
            {details && (
              <div className="flex items-center gap-2.5">
                <CreditCard className="h-4 w-4 shrink-0 text-muted-foreground" />
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Total / Payment</p>
                  <p className="text-sm font-semibold">
                    EGP {order.total.toFixed(2)}{" "}
                    <span className="text-xs font-normal capitalize text-muted-foreground">
                      ({details.payment_method})
                    </span>
                  </p>
                </div>
              </div>
            )}
            <div className="flex items-center gap-2.5">
              <Clock className="h-4 w-4 shrink-0 text-muted-foreground" />
              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Placed At</p>
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
                Products ({details.order_items.length})
              </p>
              <div className="space-y-1.5 rounded-lg border border-border p-2">
                {details.order_items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      Item #{item.shop_product_id} <span className="text-foreground">×{item.quantity}</span>
                    </span>
                    <span className="font-medium">EGP {item.total.toFixed(2)}</span>
                  </div>
                ))}
                <div className="mt-1 space-y-1 border-t border-border pt-1.5">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Subtotal</span>
                    <span>EGP {details.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Delivery fee</span>
                    <span>EGP {details.delivery_fee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-semibold">
                    <span>Total</span>
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
            Close
          </button>
        </div>
      </div>
    </div>
  );
}