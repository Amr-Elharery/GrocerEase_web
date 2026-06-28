import { z } from "zod";
import http from "@/shared/http";

export const StoreOrderSchema = z.object({
  id: z.string(),
  order_id: z.string(),
  customer_name: z.string(),
  items_count: z.number(),
  total: z.number(),
  status: z.string(),
  created_at: z.string(),
});

export type StoreOrder = z.infer<typeof StoreOrderSchema>;

export interface StoreOrderItem {
  id: number;
  shop_product_id: number;
  quantity: number;
  total: number;
}

export interface StoreOrderDetail extends StoreOrder {
  subtotal: number;
  delivery_fee: number;
  payment_method: string;
  order_items: StoreOrderItem[];
}

interface ApiOrder {
  id: number;
  customer_id: string;
  shop_id: number;
  order_group_id: number;
  status: string;
  subtotal: number;
  delivery_fee: number;
  payment_method: string;
  created_at: string;
  customer_address_id: number;
  order_items: { id: number; shop_product_id: number; quantity: number; total: number }[];
}

function mapOrder(o: ApiOrder): StoreOrder {
  const itemsCount = (o.order_items ?? []).reduce((sum, it) => sum + (it.quantity ?? 0), 0);
  return {
    id: String(o.id),
    order_id: String(o.id),
    customer_name: o.customer_id ?? "Customer",
    items_count: itemsCount,
    total: (o.subtotal ?? 0) + (o.delivery_fee ?? 0),
    status: o.status ?? "",
    created_at: o.created_at,
  };
}

export const storeOrderService = {
  async getOrders(page = 1): Promise<StoreOrder[]> {
    const limit = 10;
    const offset = (page - 1) * limit;
    const res = await http.get("/orders/shop", { params: { limit, offset } });
    const items: ApiOrder[] = res.data ?? [];
    return items
      .map(mapOrder)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  },

  async updateOrderStatus(_shopId: string, orderId: string, status: StoreOrder["status"]): Promise<void> {
    console.log("update order status", orderId, "to", status);
  },

  async getOrder(orderId: string): Promise<StoreOrderDetail> {
    const res = await http.get(`/orders/${orderId}`);
    const o: ApiOrder = res.data;
    const base = mapOrder(o);
    return {
      ...base,
      subtotal: o.subtotal ?? 0,
      delivery_fee: o.delivery_fee ?? 0,
      payment_method: o.payment_method ?? "",
      order_items: o.order_items ?? [],
    };
  },
};