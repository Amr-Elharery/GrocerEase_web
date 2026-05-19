import { useEffect, useRef, useState } from "react";
import {
  X,
  User,
  Store,
  Package,
  CreditCard,
  Clock,
  Truck,
  ChevronDown,
  Check,
} from "lucide-react";
import { type Order } from "../api/orderService";
import { useDeliveryPersonnel, useAssignOrder } from "../hooks/useOrders";
import { Button } from "@/components/ui/button";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-50 text-yellow-700 border border-yellow-200",
  processing: "bg-blue-50 text-blue-700 border border-blue-200",
  out_for_delivery: "bg-purple-50 text-purple-700 border border-purple-200",
  delivered: "bg-green-50 text-green-700 border border-green-200",
  cancelled: "bg-red-50 text-red-700 border border-red-200",
};

const statusLabels: Record<string, string> = {
  pending: "Pending",
  processing: "Processing",
  out_for_delivery: "Out for Delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

type Props = {
  order: Order;
  onClose: () => void;
};

type DeliveryPerson = {
  id: string;
  name: string;
  email: string;
};

function DeliveryPersonnelDropdown({
  value,
  personnel,
  onChange,
}: {
  value: string;
  personnel: DeliveryPerson[];
  onChange: (value: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedPerson = personnel.find((person) => person.id === value);

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

  return (
    <div ref={dropdownRef} className="relative w-full">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex h-10 w-full items-center justify-between rounded-lg border border-[#078A2D] bg-white px-3 text-sm font-medium text-[#101828] shadow-sm outline-none transition hover:bg-[#F0FDF4] focus:border-[#078A2D] focus:ring-2 focus:ring-[#078A2D]/15"
      >
        <span className="truncate">
          {selectedPerson
            ? `${selectedPerson.name} — ${selectedPerson.email}`
            : "Select delivery person..."}
        </span>

        <ChevronDown
          className={`h-4 w-4 shrink-0 text-[#078A2D] transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute bottom-[46px] left-0 z-50 max-h-[220px] w-full overflow-y-auto rounded-lg border border-[#CDE8D5] bg-white shadow-[0_12px_30px_rgba(15,23,42,0.12)]">
          {personnel.map((person) => {
            const isSelected = person.id === value;

            return (
              <button
                key={person.id}
                type="button"
                onClick={() => {
                  onChange(person.id);
                  setIsOpen(false);
                }}
                className={`flex w-full items-center justify-between gap-3 px-3 py-2.5 text-left text-sm transition ${
                  isSelected
                    ? "bg-[#EAF7EE] font-semibold text-[#078A2D]"
                    : "text-[#101828] hover:bg-[#F0FDF4]"
                }`}
              >
                <span className="min-w-0 truncate">
                  {person.name} — {person.email}
                </span>

                {isSelected && (
                  <Check className="h-4 w-4 shrink-0 text-[#078A2D]" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function OrderDetailModal({ order, onClose }: Props) {
  const { data: deliveryPersonnel = [] } = useDeliveryPersonnel();
  const assignOrder = useAssignOrder();

  const [selectedPersonnelId, setSelectedPersonnelId] = useState("");

  const effectivePersonnelId =
    selectedPersonnelId || deliveryPersonnel[0]?.id || "";

  const handleAssign = () => {
    if (!effectivePersonnelId) return;

    assignOrder.mutate(
      {
        orderId: order.id,
        deliveryPersonnelId: effectivePersonnelId,
      },
      {
        onSuccess: () => onClose(),
      }
    );
  };

  const isPending = order.status === "pending";

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 px-4 pb-8 pt-24">
      <div className="w-full max-w-md overflow-visible rounded-xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div>
            <h2 className="text-base font-semibold">Order Details</h2>

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
        <div className="space-y-4 p-5">
          {/* Status */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Status
            </span>

            <span
              className={`rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider ${statusColors[order.status]}`}
            >
              {statusLabels[order.status]}
            </span>
          </div>

          {/* Order Info */}
          <div className="space-y-3 rounded-lg bg-muted/30 p-4">
            <div className="flex items-center gap-2.5">
              <User className="h-4 w-4 shrink-0 text-muted-foreground" />

              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Customer
                </p>

                <p className="text-sm font-semibold">
                  {order.customer_name}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <Store className="h-4 w-4 shrink-0 text-muted-foreground" />

              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Store
                </p>

                <p className="text-sm font-semibold">{order.store_name}</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <Package className="h-4 w-4 shrink-0 text-muted-foreground" />

              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Items
                </p>

                <p className="text-sm font-semibold">
                  {order.items_count} items
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <CreditCard className="h-4 w-4 shrink-0 text-muted-foreground" />

              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Total / Payment
                </p>

                <p className="text-sm font-semibold">
                  EGP {order.total_price.toFixed(2)}{" "}
                  <span className="text-xs font-normal capitalize text-muted-foreground">
                    ({order.payment_method})
                  </span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <Clock className="h-4 w-4 shrink-0 text-muted-foreground" />

              <div>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Placed At
                </p>

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

          {/* Assign Delivery — only for pending orders */}
          {isPending && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4 text-muted-foreground" />

                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Assign Delivery Personnel
                </p>
              </div>

              <DeliveryPersonnelDropdown
                value={effectivePersonnelId}
                personnel={deliveryPersonnel}
                onChange={setSelectedPersonnelId}
              />

              {assignOrder.isError && (
                <p className="text-xs text-destructive">
                  Something went wrong. Please try again.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-2 border-t border-border px-5 py-4">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={onClose}
          >
            Close
          </Button>

          {isPending && (
            <Button
              size="sm"
              className="flex-1"
              disabled={!effectivePersonnelId || assignOrder.isPending}
              onClick={handleAssign}
            >
              {assignOrder.isPending ? "Assigning..." : "Assign Order"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}