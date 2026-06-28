import { z } from "zod";
import http from "@/shared/http";
import { shopApi } from "@/features/shop/api/shopApi";

export const OrderSchema = z.object({
  id: z.string(),
  order_id: z.string(),
  customer_name: z.string(),
  store_name: z.string(),
  items_count: z.number(),
  total_price: z.number(),
  status: z.string(),
  payment_method: z.string(),
  created_at: z.string(),
});

export type Order = z.infer<typeof OrderSchema>;

export interface OrderItemDetail {
  id: number;
  shop_product_id: number;
  quantity: number;
  total: number;
}

export interface OrderDetail extends Order {
  subtotal: number;
  delivery_fee: number;
  order_items: OrderItemDetail[];
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

async function buildShopNames(): Promise<Map<number, string>> {
  const map = new Map<number, string>();
  try {
    const shops = await shopApi.getAllShops({ limit: 100, offset: 0 });
    for (const s of shops) map.set(Number(s.id), s.shop_name);
  } catch {
    //   
  }
  return map;
}

function mapOrder(o: ApiOrder, shopNames: Map<number, string>): Order {
  const itemsCount = (o.order_items ?? []).reduce((sum, it) => sum + (it.quantity ?? 0), 0);
  return {
    id: String(o.id),
    order_id: String(o.id),
    customer_name: o.customer_id ?? "Customer",
    store_name: shopNames.get(o.shop_id) ?? `Shop #${o.shop_id}`,
    items_count: itemsCount,
    total_price: (o.subtotal ?? 0) + (o.delivery_fee ?? 0),
    status: o.status ?? "",
    payment_method: o.payment_method ?? "",
    created_at: o.created_at,
  };
}

export const orderService = {
  async getOrders(page = 1): Promise<Order[]> {
    const limit = 10;
    const offset = (page - 1) * limit;
    const [res, shopNames] = await Promise.all([
      http.get("/orders/admin/all", { params: { limit, offset } }),
      buildShopNames(),
    ]);
    const items: ApiOrder[] = res.data ?? [];
    return items
      .map((o) => mapOrder(o, shopNames))
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  },


  async getOrder(orderId: string): Promise<OrderDetail> {
    const [res, shopNames] = await Promise.all([
      http.get(`/orders/${orderId}`),
      buildShopNames(),
    ]);
    const o: ApiOrder = res.data;
    const base = mapOrder(o, shopNames);
    return {
      ...base,
      subtotal: o.subtotal ?? 0,
      delivery_fee: o.delivery_fee ?? 0,
      order_items: o.order_items ?? [],
    };
  },
};